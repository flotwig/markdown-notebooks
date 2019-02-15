import { createReducer } from 'redux-starter-kit';
import { getActivePage, getActivePageIndex } from './notebookSelectors';
import {
    HANDLE_EDIT,
    RENAME_PAGE,
    RENAME_NOTEBOOK,
    SET_ACTIVE_PAGE,
    SET_ACTIVE_NOTEBOOK,
    ADD_PAGE, DELETE_PAGE,
    MOVE_PAGE_TO_INDEX,
    RESTORE_DRAFT,
    RECEIVE_UPLOAD_IMAGE, REQUEST_UPLOAD_IMAGE,
    RECEIVE_SAVE, REQUEST_SAVE,
    RECEIVE_NOTEBOOKS, REQUEST_NOTEBOOKS,
    RECEIVE_NOTEBOOK, REQUEST_NOTEBOOK, RECEIVE_SAVE_ERROR, TOGGLE_OPEN_MENU
} from './notebookActions';
import Notebook from '../models/Notebook';
import NotebookPage from '../models/NotebookPage';
import moment from 'moment';

/**
 * Reducer for the state of the currently active Notebook.
 */
const notebookReducer = createReducer({
    isSaving: false,
    saveError: false,
    isLoadingNotebookList: false,
    isLoadingNotebook: false,
    notebookList: [],
    notebook: undefined,
    activePageId: undefined,
    showOpenMenu: false
}, {
    [REQUEST_SAVE]: (state) => {
        state.isSaving = true
        state.saveError = false
    },
    [RECEIVE_SAVE]: (state, { payload }) => {
        state.isSaving = false;
        state.saveError = false;
        let i = 0;
        const pages = state.notebook.pages.map(page => {
            if (page.content) {
                // all pages with content now have a gist filename
                return page.withChanges({ gistFilename: Object.values(payload.files)[i++].filename })
            }
            return page
        });
        state.notebook = state.notebook.withChanges({
            pages,
            deletedPages: [],
            saved_at: moment(),
            gistId: payload.id,
            modified: false
        })
    },
    [RECEIVE_SAVE_ERROR]: (state, { payload: error }) => {
        state.isSaving = false;
        state.saveError = true;
    },
    [REQUEST_NOTEBOOKS]: (state) => {
        state.isLoadingNotebookList = true;
    },
    [RECEIVE_NOTEBOOKS]: (state, { payload }) => {
        state.isLoadingNotebookList = false;
        state.notebookList = Notebook.fromGistList(payload);
    },
    [REQUEST_NOTEBOOK]: (state) => {
        state.isLoadingNotebook = true;
        state.notebook = undefined;
    },
    [RECEIVE_NOTEBOOK]: (state, { payload }) => {
        state.isLoadingNotebook = false;
        state.notebook = Notebook.fromGist(payload);
        state.activePageId = state.notebook.pages[0]._id
    },
    [REQUEST_UPLOAD_IMAGE]: (state, { payload }) => {
        const { cursorLocation, imageId } = payload
        let pages = [...state.notebook.pages]
        const pageIndex = getActivePageIndex(state)
        let { content } = pages[pageIndex]
        content = content.substring(0, cursorLocation)
                 + `![Pasted image](Uploading image #${imageId}...)`
                 + content.substring(cursorLocation)
        pages[pageIndex] = pages[pageIndex].withChanges({ content })
        state.notebook = state.notebook.withChanges({ pages })
    },
    [RECEIVE_UPLOAD_IMAGE]: (state, { payload }) => {
        let { response, imageId } = payload
        let pages = [...state.notebook.pages]
        let pageIndex = getActivePageIndex(state)
        let { content } = pages[pageIndex]
        content = content.replace(`![Pasted image](Uploading image #${imageId}...)`,
                                  "![Pasted image](" + response.data.link + ")")
        pages[pageIndex] = pages[pageIndex].withChanges({ content })
        state.notebook = state.notebook.withChanges({ pages })
    },
    [RENAME_PAGE]: (state, { payload }) => {
        let page = payload.page || getActivePage(state);
        if (payload.name !== page.name)
            payload.name = state.notebook.getUnusedName(payload.name, page)
        page = page.withChanges({ name: payload.name })
        let pages = [...state.notebook.pages]
        const pageIndex = pages.findIndex(p => p._id === page._id)
        pages[pageIndex] = page
        state.notebook = state.notebook.withChanges({ pages })
    },
    [HANDLE_EDIT]: (state, { payload }) => {
        let pages = [...state.notebook.pages]
        let pageIndex = getActivePageIndex(state)
        pages[pageIndex] = pages[pageIndex].withChanges(payload)
        state.notebook = state.notebook.withChanges({ pages })
    },
    [SET_ACTIVE_NOTEBOOK]: (state, { payload }) => {
        state.notebook = payload;
        if (payload) state.activePageId = payload.pages[0]._id;
        else state.activePageId = undefined;
    },
    [SET_ACTIVE_PAGE]: (state, { payload }) => {
        if (payload) state.activePageId = payload._id;
        else state.activePageId = undefined
    },
    [MOVE_PAGE_TO_INDEX]: (state, { payload }) => {
        // note: `index` is expected to be relative to the list of pages WITHOUT `page`
        const { page, index } = payload;
        let pages = state.notebook.pages.filter(p => p !== page)
        pages.splice(index, 0, page)
        state.notebook = state.notebook.withChanges({ pages })
    },
    [ADD_PAGE]: (state) => {
        const page = new NotebookPage(state.notebook.getUnusedName())
        const pageIndex = getActivePageIndex(state)
        let pages = [...state.notebook.pages]
        pages.splice(pageIndex, 0, page)
        state.activePageId = page._id
        state.notebook = state.notebook.withChanges({ pages })
    },
    [DELETE_PAGE]: (state, { payload }) => {
        if (!payload) payload = getActivePage(state)
        const pageIndex = state.notebook.pages.findIndex(p=> p._id === payload._id)
        let pages = state.notebook.pages.filter(page => payload._id !== page._id)
        state.notebook = state.notebook.withChanges({ pages })
        if (pages.length === 0) {
            // always have at least 1 page
            pages = [new NotebookPage(state.notebook.getUnusedName())]
        }
        const deletedPages = [...state.notebook.deletedPages, payload]
        state.notebook = state.notebook.withChanges({ deletedPages, pages })
        if (payload._id === state.activePageId || pages.length === 1) {
            // activate another page
            if (pages[pageIndex - 1]) {
                state.activePageId = pages[pageIndex - 1]._id
            } else {
                state.activePageId = pages[0]._id
            }
        }
    },
    [RENAME_NOTEBOOK]: (state, { payload }) => {
        if (!payload) payload = 'Untitled Notebook'
        state.notebook = state.notebook.withChanges({
            name: payload
        })
    },
    [RESTORE_DRAFT]: (state, { payload: draft }) => {
        state.notebook = draft.notebook
        state.activePageId = draft.activePageId || draft.pages[0]._id
    },
    [TOGGLE_OPEN_MENU]: (state, { payload: showOpenMenu }) => {
        if (showOpenMenu !== undefined)
            this.state.showOpenMenu = showOpenMenu
        else
            this.state.showOpenMenu = !this.state.showOpenMenu
    }
})

export default notebookReducer;

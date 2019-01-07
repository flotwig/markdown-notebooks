import { createReducer } from 'redux-starter-kit';
import { getActivePage } from './notebookSelectors';
import { 
    HANDLE_EDIT, 
    RENAME_PAGE,
    RENAME_NOTEBOOK,
    SET_ACTIVE_PAGE,
    SET_ACTIVE_NOTEBOOK,
    ADD_PAGE, DELETE_PAGE,
    RECEIVE_UPLOAD_IMAGE, REQUEST_UPLOAD_IMAGE,
    RECEIVE_SAVE, REQUEST_SAVE, 
    RECEIVE_NOTEBOOKS, REQUEST_NOTEBOOKS, 
    RECEIVE_NOTEBOOK, REQUEST_NOTEBOOK, RECEIVE_SAVE_ERROR 
} from './notebookActions';
import Notebook from '../models/Notebook';
import NotebookPage from '../models/NotebookPage';
import moment from 'moment';

const initialNotebook = new Notebook();

/**
 * Reducer for the state of the currently active Notebook.
 */
const notebookReducer = createReducer({
    isSaving: false,
    saveError: false,
    isLoadingNotebookList: false,
    isLoadingNotebook: false,
    notebookList: [],
    notebook: initialNotebook,
    activePageId: initialNotebook.pages[0]._id,
}, {
    [REQUEST_SAVE]: (state) => {
        state.isSaving = true
        state.saveError = false
    },
    [RECEIVE_SAVE]: (state, { payload }) => {
        state.isSaving = false;
        state.saveError = false;
        state.notebook = state.notebook.withChanges({
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
        const cursorLocation = payload
        let pages = state.notebook.pages.slice()
        const pageIndex = pages.findIndex(page => page._id === state.activePageId)
        let { content } = pages[pageIndex]
        content = content.substring(0, cursorLocation)
                 + "![Pasted image](Uploading...)" 
                 + content.substring(cursorLocation)
        pages[pageIndex] = Object.assign(new NotebookPage(), pages[pageIndex], { content })
        state.notebook = state.notebook.withChanges({ pages })
    },
    [RECEIVE_UPLOAD_IMAGE]: (state, { payload }) => {
        let pages = state.notebook.pages.slice()
        let pageIndex = pages.findIndex(page => page._id === state.activePageId)
        let { content } = pages[pageIndex]
        content = content.replace("![Pasted image](Uploading...)", 
                                  "![Pasted image](" + payload.data.link + ")")
        pages[pageIndex] = Object.assign(new NotebookPage(), pages[pageIndex], { content })
        state.notebook = state.notebook.withChanges({ pages })
    },
    [RENAME_PAGE]: (state, { payload }) => {
        let page = payload.page || getActivePage(state);
        if (payload.name !== page.name)
            payload.name = state.notebook.getUnusedName(payload.name)
        page = Object.assign(new NotebookPage(), page, { name: payload.name })
        let pages = state.notebook.pages.slice()
        const pageIndex = pages.findIndex(p => p._id === page._id)
        pages[pageIndex] = page
        state.notebook = state.notebook.withChanges({ pages })
    },
    [HANDLE_EDIT]: (state, { payload }) => {
        let pages = state.notebook.pages.slice()
        let pageIndex = pages.findIndex(page => page._id === state.activePageId)
        pages[pageIndex] = Object.assign(new NotebookPage(), pages[pageIndex], payload)
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
    [ADD_PAGE]: (state) => {
        let pages = state.notebook.pages.slice()
        const page = new NotebookPage(state.notebook.getUnusedName())
        pages.push(page)
        state.activePageId = page._id
        state.notebook = state.notebook.withChanges({ pages })
    },
    [DELETE_PAGE]: (state, { payload }) => {
        if (!payload) payload = getActivePage(state)
        const pageIndex = state.notebook.pages.findIndex(p=> p._id === payload._id)
        let pages = state.notebook.pages.filter(page => payload._id !== page._id)
        state.notebook = Object.assign(new Notebook(), state.notebook, { pages })
        if (pages.length === 0) {
            // always have at least 1 page
            pages = [new NotebookPage(state.notebook.getUnusedName())]
        }
        state.notebook = state.notebook.withChanges({ pages })
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
    }
})

export default notebookReducer;
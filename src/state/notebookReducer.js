import { createReducer } from 'redux-starter-kit';
import { 
    HANDLE_EDIT, 
    SET_ACTIVE_PAGE,
    SET_ACTIVE_NOTEBOOK,
    ADD_PAGE, DELETE_PAGE,
    RECEIVE_SAVE, REQUEST_SAVE, 
    RECEIVE_NOTEBOOKS, REQUEST_NOTEBOOKS, 
    RECEIVE_NOTEBOOK, REQUEST_NOTEBOOK 
} from './notebookActions';
import Notebook from '../models/Notebook';
import NotebookPage from '../models/NotebookPage';
import moment from 'moment';

var initialNotebook = new Notebook();

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
        state.isSaving = false
        state.saveError = false
    },
    [RECEIVE_SAVE]: (state, { payload }) => {
        state.isSaving = false;
        state.saveError = false; // TODO
        if (!state.saveError) {
            state.notebook = Object.assign(new Notebook(), state.notebook, {
                saved_at: moment(),
                gistId: payload.id
            })
        }
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
    [HANDLE_EDIT]: (state, { payload }) => {
        let pages = state.notebook.pages.slice()
        let pageIndex = pages.findIndex(page => page._id === state.activePageId)
        if (payload.name !== pages[pageIndex].name)
            payload.name = state.notebook.getUnusedName(payload.name)
        pages[pageIndex] = Object.assign(new NotebookPage(), pages[pageIndex], payload)
        state.notebook = Object.assign(new Notebook(), state.notebook, {
            updated_at: moment(),
            modified: true,
            pages
        })
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
        pages.push(new NotebookPage(state.notebook.getUnusedName()))
        state.notebook = Object.assign(new Notebook(), state.notebook, { pages })
    },
    [DELETE_PAGE]: (state, { payload }) => {
        if (!payload) payload = state.notebook.pages.find(p => p._id === state.activePageId)
        let pages = state.notebook.pages.filter(page => payload._id !== page._id)
        state.notebook = Object.assign(new Notebook(), state.notebook, { pages })
        if (pages.length === 0) {
            pages = [new NotebookPage(state.notebook.getUnusedName())]
        }
        state.notebook = Object.assign(new Notebook(), state.notebook, { pages })
        if (payload._id === state.activePageId || pages.length === 1) {
            state.activePageId = pages[0]._id
        }
    }
})

export default notebookReducer;
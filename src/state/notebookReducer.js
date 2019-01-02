import { createReducer } from 'redux-starter-kit';
import { HANDLE_EDIT, RECEIVE_SAVE, REQUEST_SAVE, RECEIVE_NOTEBOOKS, REQUEST_NOTEBOOKS } from './notebookActions';
import Notebook from '../models/Notebook';
import NotebookPage from '../models/NotebookPage';
import moment from 'moment';

const notebookReducer = createReducer({
    isSaving: false,
    saveError: false,
    isLoadingNotebookList: false,
    notebookList: [],
    notebook: new Notebook()
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
    [HANDLE_EDIT]: (state, { payload }) => {
        let pages = state.notebook.pages.slice()
        pages[payload.activePage] = Object.assign(new NotebookPage(), pages[payload.activePage], payload.page)
        state.notebook = Object.assign(new Notebook(), state.notebook, {
            updated_at: moment(),
            modified: true,
            pages
        })
    }
})

export default notebookReducer;
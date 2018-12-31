import { createReducer } from 'redux-starter-kit';
import { HANDLE_EDIT, RECEIVE_SAVE, REQUEST_SAVE } from './notebookActions';
import Notebook from '../models/Notebook';
import NotebookPage from '../models/NotebookPage';

const notebookReducer = createReducer({
    isSaving: false,
    saveError: false,
    notebook: new Notebook()
}, {
    [RECEIVE_SAVE]: (state, { payload }) => {
        let json = payload
        state.isSaving = false;
        state.saveError = false; // TODO
        if (!state.saveError) {
            state.notebook = Object.assign(new Notebook(), state.notebook, {
                saved_at: new Date(),
                gistId: json.id
            })
        }
    },
    [REQUEST_SAVE]: (state) => {
        state.isSaving = false
        state.saveError = false
    },
    [HANDLE_EDIT]: (state, { payload }) => {
        let pages = state.notebook.pages.slice()
        pages[payload.activePage] = Object.assign(new NotebookPage(), pages[payload.activePage], payload.page)
        state.notebook = Object.assign(new Notebook(), state.notebook, {
            updated_at: new Date(),
            modified: true,
            pages
        })
    }
})

export default notebookReducer;
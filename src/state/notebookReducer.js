import { createReducer } from 'redux-starter-kit';

function setActiveNotebook(state, notebook) {
    state.activeNotebook = notebook;
}

function setActiveNotebookPage(state, notebookPage) {
    state.activeNotebookPage = notebookPage;
}

const notebookReducer = createReducer({}, {
    SET_ACTIVE_NOTEBOOK: setActiveNotebook,
    SET_ACTIVE_NOTEBOOK_PAGE: setActiveNotebookPage
})

export default notebookReducer;
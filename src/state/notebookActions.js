import { createAction } from 'redux-starter-kit';
import { GitHubApi } from '../GitHub';

export const REQUEST_SAVE = createAction('REQUEST_SAVE');
export const RECEIVE_SAVE = createAction('RECEIVE_SAVE');
export const REQUEST_NOTEBOOKS = createAction('REQUEST_NOTEBOOKS');
export const RECEIVE_NOTEBOOKS = createAction('RECEIVE_NOTEBOOKS');
export const REQUEST_NOTEBOOK = createAction('REQUEST_NOTEBOOK');
export const RECEIVE_NOTEBOOK = createAction('RECEIVE_NOTEBOOK');
export const HANDLE_EDIT = createAction('HANDLE_EDIT');

export function FETCH_SAVE(notebook) {
    return function(dispatch) {
        dispatch(REQUEST_SAVE())
        let gist = notebook.toGist();
        (notebook.gistId ? 
            GitHubApi.updateGist(notebook.gistId, gist) :
            GitHubApi.createGist(gist)
        ).then(response => dispatch(RECEIVE_SAVE(response)))
    }
}

export function FETCH_NOTEBOOKS() {
    return function(dispatch) {
        dispatch(REQUEST_NOTEBOOKS())
        GitHubApi.listOwnedGists()
                 .then(response => dispatch(RECEIVE_NOTEBOOKS(response)))
    }
}

export function FETCH_NOTEBOOK(notebook) {
    return function(dispatch) {
        dispatch(REQUEST_NOTEBOOK())
        GitHubApi.getGist(notebook.gistId)
                 .then(response => dispatch(RECEIVE_NOTEBOOK(response)))
    }
}
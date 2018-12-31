import { createAction } from 'redux-starter-kit';
import { GitHubApi } from '../GitHub';

export const REQUEST_SAVE = createAction('REQUEST_SAVE');
export const RECEIVE_SAVE = createAction('RECEIVE_SAVE');
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
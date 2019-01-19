import { createAction } from 'redux-starter-kit';
import { GitHubApi } from '../GitHubApi';
import ImgurApi from '../ImgurApi';

export const REQUEST_SAVE = createAction('REQUEST_SAVE');
export const RECEIVE_SAVE = createAction('RECEIVE_SAVE');
export const RECEIVE_SAVE_ERROR = createAction('RECEIVE_SAVE_ERROR');
export const REQUEST_NOTEBOOKS = createAction('REQUEST_NOTEBOOKS');
export const RECEIVE_NOTEBOOKS = createAction('RECEIVE_NOTEBOOKS');
export const REQUEST_NOTEBOOK = createAction('REQUEST_NOTEBOOK');
export const RECEIVE_NOTEBOOK = createAction('RECEIVE_NOTEBOOK');
export const REQUEST_UPLOAD_IMAGE = createAction('REQUEST_UPLOAD_IMAGE');
export const RECEIVE_UPLOAD_IMAGE = createAction('RECEIVE_UPLOAD_IMAGE');
export const SET_ACTIVE_PAGE = createAction('SET_ACTIVE_PAGE');
export const SET_ACTIVE_NOTEBOOK = createAction('SET_ACTIVE_NOTEBOOK');
export const HANDLE_EDIT = createAction('HANDLE_EDIT');
export const RENAME_PAGE = createAction('RENAME_PAGE');
export const ADD_PAGE = createAction('ADD_PAGE');
export const DELETE_PAGE = createAction('DELETE_PAGE');
export const MOVE_PAGE_TO_INDEX = createAction('MOVE_PAGE_TO_INDEX');
export const RENAME_NOTEBOOK = createAction('RENAME_NOTEBOOK');
export const RESTORE_DRAFT = createAction('RESTORE_DRAFT');

export function UPLOAD_IMAGE(blob, cursorLocation) {
    // TODO: enqueue uploads, right now multiple simultaneous uploads can break due to a race condition
    return function(dispatch) {
        dispatch(REQUEST_UPLOAD_IMAGE(cursorLocation))
        ImgurApi.blobToBase64(blob, image =>
            ImgurApi.uploadImage(image, 'Pasted image from Markdown Notebooks https://mdnb.bloomqu.ist/')
                .then(response => dispatch(RECEIVE_UPLOAD_IMAGE(response))))
    }
}

export function FETCH_SAVE(notebook) {
    return function(dispatch) {
        dispatch(REQUEST_SAVE())
        let gist = notebook.toGist();
        (notebook.gistId ? // if it has an ID, it's been saved, make a new revision
            GitHubApi.updateGist(notebook.gistId, gist) :
            GitHubApi.createGist(gist)
        ).then(response => {
            if (response) {
                dispatch(RECEIVE_SAVE(response))
            } else {
                throw new Error()
            }
        }).catch(error => dispatch(RECEIVE_SAVE_ERROR(error)))
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
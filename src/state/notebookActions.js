import { createAction } from 'redux-starter-kit';
import { GitHubApi } from '../lib/GitHubApi';
import { withAuth } from './util';
import moment from 'moment';
import ImgurApi from '../lib/ImgurApi';
import { SET_PATHNAME } from './router';

export const REQUEST_SAVE = createAction('REQUEST_SAVE');
export const RECEIVE_SAVE = createAction('RECEIVE_SAVE');
export const RECEIVE_SAVE_ERROR = createAction('RECEIVE_SAVE_ERROR');
export const REQUEST_NOTEBOOKS = createAction('REQUEST_NOTEBOOKS');
export const RECEIVE_NOTEBOOKS = createAction('RECEIVE_NOTEBOOKS');
export const REQUEST_NOTEBOOK = createAction('REQUEST_NOTEBOOK');
export const RECEIVE_NOTEBOOK = createAction('RECEIVE_NOTEBOOK');
export const RECEIVE_NOTEBOOK_ERROR = createAction('RECEIVE_NOTEBOOK_ERROR');
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
export const TOGGLE_OPEN_MENU = withAuth(createAction('TOGGLE_OPEN_MENU'));

let imageCounter = 0;

export function UPLOAD_IMAGE(blob, cursorLocation) {
    // TODO: enqueue uploads, right now multiple simultaneous uploads can break due to a race condition
    return function(dispatch) {
        const imageId = ++imageCounter;
        dispatch(REQUEST_UPLOAD_IMAGE({ cursorLocation, imageId }))
        ImgurApi.blobToBase64(blob, image =>
            ImgurApi.uploadImage(image, 'Pasted image from Markdown Notebooks https://mdnb.bloomqu.ist/')
                .then(response => dispatch(RECEIVE_UPLOAD_IMAGE({ response, imageId }))))
    }
}

export const FETCH_SAVE = withAuth((notebook, obj) => {
    const fork = obj && obj.fork
    return function(dispatch) {
        dispatch(REQUEST_SAVE())

        const chain = function() {
            if (fork === true) {
                return GitHubApi.forkGist(notebook.gistId).then(forkedGist => {
                    notebook.gistId = forkedGist.id
                    return GitHubApi.updateGist(notebook.gistId, notebook.toGist())
                })
            }
            let gist = notebook.toGist();
            if (notebook.gistId) {
                return GitHubApi.updateGist(notebook.gistId, gist)
            }
            return GitHubApi.createGist(gist)
        }

        chain()
        .then(response => {
            if (response) {
                dispatch(RECEIVE_SAVE(response))
                if (response.id) {
                    dispatch(SET_PATHNAME(`/${response.owner.login}/${response.id}`))
                }
            } else {
                throw new Error()
            }
        }).catch(error => dispatch(RECEIVE_SAVE_ERROR(error)))
    }
})

export const FETCH_NOTEBOOKS = withAuth(() => {
    return function(dispatch) {
        dispatch(REQUEST_NOTEBOOKS())
        GitHubApi.listOwnedGists(moment().subtract(30, 'days'))
                 .then(response => dispatch(RECEIVE_NOTEBOOKS(response)))
    }
})

export function FETCH_NOTEBOOK(notebook) {
    return function(dispatch) {
        dispatch(REQUEST_NOTEBOOK())
        GitHubApi.getGist(notebook.gistId)
                 .then(response => dispatch(RECEIVE_NOTEBOOK(response)))
                 .catch(error => dispatch(RECEIVE_NOTEBOOK_ERROR(error)))
    }
}

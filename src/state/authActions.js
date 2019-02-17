import { createAction } from 'redux-starter-kit';
import { GitHubApi } from '../GitHubApi';

export const REQUEST_TOKEN = createAction('REQUEST_TOKEN');
export const RECEIVE_TOKEN = createAction('RECEIVE_TOKEN');
export const TOGGLE_AUTH_PROMPT = createAction('TOGGLE_AUTH_PROMPT');
export const SET_TOKEN = createAction('SET_TOKEN');
export const RECEIVE_USER = createAction('RECEIVE_USER');

export function FETCH_TOKEN(code, stateId) {
    return function(dispatch) {
        dispatch(REQUEST_TOKEN())
        GitHubApi.getAccessToken(code, stateId).then(token => {
            dispatch(RECEIVE_TOKEN(token))
            GitHubApi.storeAuth(!!token, token)
            dispatch(FETCH_USER())
        })
    }
}

export function FETCH_USER() {
    return function(dispatch) {
        GitHubApi.getCurrentUser().then(user =>
            dispatch(RECEIVE_USER(user))
        )
        .catch(() => {
            dispatch(SET_TOKEN(undefined))
        })
    }
}

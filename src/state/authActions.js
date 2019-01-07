import { createAction } from 'redux-starter-kit';
import { GitHubApi } from '../GitHubApi';

export const REQUEST_TOKEN = createAction('REQUEST_TOKEN');
export const RECEIVE_TOKEN = createAction('RECEIVE_TOKEN');

export function FETCH_TOKEN(code, stateId) {
    return function(dispatch) {
        dispatch(REQUEST_TOKEN())
        GitHubApi.getAccessToken(code, stateId).then(token => {
            dispatch(RECEIVE_TOKEN(token))
            GitHubApi.storeAuth(!!token, token)
        })
    }
}
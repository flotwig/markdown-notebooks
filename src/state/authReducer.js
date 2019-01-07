import { createReducer } from 'redux-starter-kit';
import { REQUEST_TOKEN, RECEIVE_TOKEN } from './authActions';
import { GitHubApi } from '../GitHubApi';

/**
 * Reducer for GitHub authentication logic.
 */
const authReducer = createReducer({
    ...GitHubApi.getStoredAuth(),
    isLoadingToken: false
}, {
    [RECEIVE_TOKEN]: (state, { payload }) => {
        state.token = payload
        state.valid = !!payload
        state.isLoadingToken = false
    },
    [REQUEST_TOKEN]: (state) => {
        state.isLoadingToken = true
    }
})

export default authReducer;
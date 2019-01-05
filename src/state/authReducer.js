import { createReducer } from 'redux-starter-kit';
import { GitHubApi } from '../GitHubApi';
import { SET_TOKEN } from './authActions';

/**
 * Reducer for GitHub authentication logic.
 */
const authReducer = createReducer(GitHubApi.getStoredAuth(), {
    [SET_TOKEN]: (state, { payload }) => {
        state.token = payload
        state.valid = !!payload
    }
})

export default authReducer;
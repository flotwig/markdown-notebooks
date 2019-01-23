import { createReducer } from 'redux-starter-kit';
import { 
    REQUEST_TOKEN, RECEIVE_TOKEN,
    TOGGLE_AUTH_PROMPT
} from './authActions';
import { GitHubApi } from '../GitHubApi';

/**
 * Reducer for GitHub authentication logic.
 */
const authReducer = createReducer({
    ...GitHubApi.getStoredAuth(),
    isLoadingToken: false,
    showAuthPrompt: false
}, {
    [RECEIVE_TOKEN]: (state, { payload }) => {
        state.token = payload
        state.valid = !!payload
        state.isLoadingToken = false
        state.showAuthPrompt = false
    },
    [REQUEST_TOKEN]: (state) => {
        state.isLoadingToken = true
        state.showAuthPrompt = true
    },
    [TOGGLE_AUTH_PROMPT]: (state, { payload: showAuthPrompt }) => {
        if (showAuthPrompt !== undefined)
            state.showAuthPrompt = showAuthPrompt
        else
            state.showAuthPrompt = !state.showAuthPrompt
    }
})

export default authReducer;
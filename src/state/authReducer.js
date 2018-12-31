import { createReducer } from 'redux-starter-kit';
import { GitHubApi } from '../GitHub';

function setToken(state, token) {
    state.token = token;
}

function setValid(state, valid) {
    state.valid = valid;
}

const authReducer = createReducer(GitHubApi.getStoredAuth(), {
    SET_TOKEN: setToken,
    SET_VALID: setValid
})

export default authReducer;
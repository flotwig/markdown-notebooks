import { TOGGLE_AUTH_PROMPT } from "./authActions";

export const withAuth = (thunk) => {
    return function() {
        const args = arguments || []
        return function(dispatch, getState) {
            if (!getState().auth.valid) {
                dispatch(TOGGLE_AUTH_PROMPT(true), getState)
            } else {
                thunk(...args)(dispatch, getState)
            }
        }
    }
}
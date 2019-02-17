import { createAction, createReducer } from 'redux-starter-kit'
import { createBrowserHistory } from 'history'
import { FETCH_NOTEBOOK } from './notebookActions';

const history = createBrowserHistory()

export const SET_PATHNAME = createAction('SET_PATHNAME')

const ROUTE = function(pathname) {
    return (dispatch, getState) => {
        const matches = /^\/(.+)\/(.+)/.exec(pathname)
        if (!matches) return
        const [gistOwnerLogin, gistId] = matches.slice(1)
        if (gistOwnerLogin && gistId && (!getState().notebook.notebook || gistId !== getState().notebook.notebook.gistId)) {
            dispatch(FETCH_NOTEBOOK({
                gistId
            }))
        }
    }
}

export const routerReducer = createReducer({
    pathname: null
},
{
    [SET_PATHNAME]: (state, { payload: pathname }) => {
        state.pathname = pathname
    }
})

export const withRouter = (store) => {
    history.listen((location) => {
        store.dispatch(ROUTE(location.pathname))
    })

    store.subscribe(() => {
        const pathname = store.getState().location.pathname
        if (pathname !== history.location.pathname) {
            history.push(store.getState().location.pathname)
        }
    })

    store.dispatch(SET_PATHNAME(history.location.pathname))
    store.dispatch(ROUTE(history.location.pathname))

    return store
}

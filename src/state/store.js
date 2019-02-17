import { configureStore } from 'redux-starter-kit'
import { withRouter, routerReducer } from './router'
import authReducer from './authReducer'
import notebookReducer from './notebookReducer'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

const reducer = {
    auth: authReducer,
    notebook: notebookReducer,
    location: routerReducer
}

const middleware = [
    thunk,
    logger
]

export const store = withRouter(configureStore({
    reducer,
    middleware
}))

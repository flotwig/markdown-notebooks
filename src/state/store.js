import { configureStore } from 'redux-starter-kit'
import { withRouter, routerReducer } from './router'
import { NODE_ENV } from '../env'
import authReducer from './authReducer'
import notebookReducer from './notebookReducer'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

const reducer = {
    auth: authReducer,
    notebook: notebookReducer,
    location: routerReducer
}

let middleware = [
    thunk
]

if (NODE_ENV === 'development') {
    middleware.push(logger)
}

export const store = withRouter(configureStore({
    reducer,
    middleware
}))

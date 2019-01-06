import { configureStore } from 'redux-starter-kit';
import authReducer from './authReducer';
import notebookReducer from './notebookReducer';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

const reducer = {
    auth: authReducer,
    notebook: notebookReducer
}

const middleware = [
    thunk,
    logger
]

export const store = configureStore({
    reducer,
    middleware
})
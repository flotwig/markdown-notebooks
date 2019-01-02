import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import authReducer from './authReducer';
import notebookReducer from './notebookReducer';
import logger from 'redux-logger';

const reducer = {
    auth: authReducer,
    notebook: notebookReducer
}

const middleware = [...getDefaultMiddleware(), logger]

export const store = configureStore({
    reducer,
    middleware
})
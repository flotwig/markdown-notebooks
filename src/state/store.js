import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import authReducer from './authReducer';
import notebookReducer from './notebookReducer';
import logger from 'redux-logger';
import Notebook from '../models/Notebook';

const reducer = {
    auth: authReducer,
    notebook: notebookReducer
}

const middleware = [...getDefaultMiddleware(), logger]

const preloadedState = {
    notebook: {
        isSaving: false,
        saveError: false,
        isLoadingNotebookList: false,
        notebookList: [],
        notebook: new Notebook()
    }
}

export const store = configureStore({
    reducer,
    middleware,
    preloadedState
})
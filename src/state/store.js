import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import authReducer from './authReducer';
import notebookReducer from './notebookReducer';

const reducer = {
    auth: authReducer,
    notebook: notebookReducer
}

const middleware = [...getDefaultMiddleware()]

export const store = configureStore({
    reducer,
    devTools: true,
    middleware
})
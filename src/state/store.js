import { configureStore } from 'redux-starter-kit';
import authReducer from './authReducer';
import notebookReducer from './notebookReducer';

const reducer = {
    auth: authReducer,
    notebook: notebookReducer
}

export const store = configureStore({
    reducer,
    devTools: true
})
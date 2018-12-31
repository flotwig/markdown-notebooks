import { configureStore } from 'redux-starter-kit';
import authReducer from './authReducer';

const reducer = {
    auth: authReducer
}

export const store = configureStore({
    reducer,
    devTools: true
})
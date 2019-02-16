import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './variables.scss';
import App from './App';
import { store } from './state/store';
import { Provider } from 'react-redux';

ReactDOM.render((
    <Provider store={store}>
        <App />
    </Provider>
), document.getElementById('root'));

if (window.Cypress) {
    window.store = store
}

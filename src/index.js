import React from 'react';
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './index.css'
import './variables.scss'
import App from './App'
import { store } from './state/store'

ReactDOM.render((
    <Provider store={store}>
        <App />
    </Provider>
), document.getElementById('root'));

if (window.Cypress) {
    window.store = store
}

/* @flow */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import configureStore from './store/configureStore';
import './styles/index.css';

const rootElement = document.getElementById('root');
const store = configureStore();

ReactDOM.render(
	<Provider store={store}><App /></Provider>,
    rootElement
);

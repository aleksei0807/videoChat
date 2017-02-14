import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import * as reducers from '../reducers';
import saga from '../sagas';

const sagaMiddleware = createSagaMiddleware();
const createStoreWithMiddleware = applyMiddleware(thunkMiddleware, sagaMiddleware)(createStore);

export default function configureStore(initialState: any) {
	const store = createStoreWithMiddleware(
		combineReducers(reducers),
		initialState,
		typeof window === 'object'
		&& typeof window.devToolsExtension !== 'undefined'
		? window.devToolsExtension() : (f: Function) => f);

	if (module.hot && typeof module.hot.accept === 'function') {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept('../reducers', () => {
			const nextRootReducer = require('../reducers');

			store.replaceReducer(nextRootReducer);
		});
	}

	sagaMiddleware.run(saga);

	return store;
}

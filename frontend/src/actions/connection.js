/* @flow */
import type { Action } from '../types/action';

export const CONNECTION_START = 'CONNECTION_START';
export const CONNECTION_SUCCESS = 'CONNECTION_SUCCESS';
export const SEND = 'SEND';

export function connection() {
	return (dispatch: (action: Action) => Action) => {
		dispatch({
			type: CONNECTION_START,
		});
	};
}

export function send(msg: Object) {
	return (dispatch: (action: Action) => Action) => {
		dispatch({
			type: SEND,
			payload: msg,
		});
	};
}

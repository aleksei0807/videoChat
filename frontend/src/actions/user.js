/* @flow */
import type { Action } from '../types/action';
import { SEND } from './connection';

export const LOGIN_START = 'LOGIN_START';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGOUT = 'LOGOUT';

export function login(email: string) {
	return (dispatch: (action: Action) => Action) => {
		if (email.length > 0) {
			dispatch({
				type: SEND,
				payload: {
					type: 'login',
					email,
				},
			});
		}
	};
}

export function logout() {
	return (dispatch: (action: Action) => Action, getStore: Function) => {
		dispatch({
			type: SEND,
			payload: {
				type: 'logout',
				email: getStore().user.email,
			},
		});
	};
}

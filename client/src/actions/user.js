// @flow
import type { Action } from '../types/action';
import { send } from './connection';

export const LOGIN_START = 'LOGIN_START';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGOUT = 'LOGOUT';
export const LOGOUT_ERROR = 'LOGOUT_ERROR';

export function login(email: string) {
	return (dispatch: (action: Action) => Action, getStore: Function) => {
		if (email.length > 0) {
			dispatch({
				type: LOGIN_START,
				payload: {
					email,
				},
			});
			send({
				type: 'login',
				name: email,
			})(dispatch, getStore);
		}
	};
}

export function loginEnd(success: boolean) {
	return (dispatch: (action: Action) => Action) => {
		if (success) {
			dispatch({
				type: LOGIN_SUCCESS,
			});
		} else {
			dispatch({
				type: LOGIN_ERROR,
			});
		}
	};
}

export function logout() {
	return (dispatch: (action: Action) => Action, getStore: Function) => {
		send({
			type: 'logout',
		})(dispatch, getStore);
	};
}

export function logoutEnd(success: boolean) {
	return (dispatch: (action: Action) => Action) => {
		if (success) {
			dispatch({
				type: LOGOUT,
			});
		} else {
			dispatch({
				type: LOGOUT_ERROR,
			});
		}
	};
}

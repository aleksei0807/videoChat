/* @flow */
import type { Action } from '../types/action';
import {
	LOGIN_SUCCESS,
	LOGIN_ERROR,
	LOGOUT,
} from '../actions/user';
import { SEND } from '../actions/connection';

const defaultState = {
	email: null,
	loginEmail: null,
	error: false,
};

export default function general(state: Object = defaultState, action: Action) {
	switch (action.type) {
	case SEND: {
		if (action.payload && action.payload.type === 'login') {
			return {...state, ...{ loginEmail: action.payload.email, error: false } };
		}
		return state;
	}
	case LOGIN_SUCCESS:
		return {...state, ...{ loginEmail: null, email: state.loginEmail, error: false }};
	case LOGIN_ERROR:
		return {...state, ...{ loginEmail: null, error: true } };
	case LOGOUT:
		return defaultState;
	default:
		return state;
	}
}

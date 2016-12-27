// @flow
import type { Action } from '../types/action';
import {
	LOGIN_START,
	LOGIN_SUCCESS,
	LOGIN_ERROR,
	LOGOUT,
	LOGOUT_ERROR,
} from '../actions/user';

const defaultState = {
	email: null,
	loginEmail: null,
	error: false,
	logoutError: false,
};

export default function general(state: Object = defaultState, action: Action) {
	switch (action.type) {
	case LOGIN_START: {
		if (action.payload) {
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
	case LOGOUT_ERROR:
		return {...state, ...{ logoutError: true } };
	default:
		return state;
	}
}

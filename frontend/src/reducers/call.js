/* @flow */
import type { Action } from '../types/action';
import {
	END_LEAVE,
	CALL,
	HANDLE_OFFER,
	HANDLE_ERROR } from '../actions/call';
import { LOGOUT } from '../actions/user';

const defaultState = {
	email: null,
};

export default function general(state: Object = defaultState, action: Action) {
	switch (action.type) {
	case END_LEAVE:
		return {...state, ...{ email: null } };
	case LOGOUT:
		return {...state, ...{ email: null } };
	case HANDLE_ERROR:
		return {...state, ...{ email: null } };
	case CALL: {
		if (action.payload) {
			return {...state, ...{ email: action.payload.email } };
		}
		return state;
	}
	case HANDLE_OFFER: {
		if (action.payload) {
			return {...state, ...{ email: action.payload.email } };
		}
		return state;
	}
	default:
		return state;
	}
}

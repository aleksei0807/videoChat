/* @flow */
import type { Action } from '../types/action';
import { ERROR } from '../actions/error';

const defaultState = {
	message: null,
};

export default function general(state: Object = defaultState, action: Action) {
	switch (action.type) {
	case ERROR: {
		if (action.payload) {
			return {...state, ...{ message: action.payload.message } };
		}
		return state;
	}
	default:
		return state;
	}
}

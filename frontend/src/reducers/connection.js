/* @flow */
import type { Action } from '../types/action';
import { CONNECTION_SUCCESS } from '../actions/connection';

const defaultState = false;

export default function general(state: boolean = defaultState, action: Action) {
	switch (action.type) {
	case CONNECTION_SUCCESS:
		return true;
	default:
		return state;
	}
}

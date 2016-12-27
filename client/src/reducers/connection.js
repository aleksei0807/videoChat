// @flow
import type { Action } from '../types/action';
import { CONNECTION } from '../actions/connection';

const defaultState = false;

export default function general(state: boolean = defaultState, action: Action) {
	switch (action.type) {
	case CONNECTION:
		return true;
	default:
		return state;
	}
}

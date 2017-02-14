/* @flow */
import type { Action } from '../types/action';

export const LEAVE = 'LEAVE';
export const END_LEAVE = 'END_LEAVE';
export const CALL = 'CALL';
export const HANDLE_OFFER = 'HANDLE_OFFER';
export const HANDLE_ANSWER = 'HANDLE_ANSWER';
export const CALL_COMPLIETED = 'CALL_COMPLIETED';
export const HANDLE_CANDIDATE = 'HANDLE_CANDIDATE';
export const ADD_CANDIDATE = 'ADD_CANDIDATE';
export const HANDLE_ERROR = 'HANDLE_ERROR';

export function call(callToUsername: string) {
	return (dispatch: (action: Action) => Action) => {
		if (callToUsername.length > 0) {
			dispatch({
				type: HANDLE_OFFER,
				payload: {
					email: callToUsername,
				},
			});
		}
	};
}

export function hangUp() {
	return (dispatch: (action: Action) => Action) => {
		dispatch({
			type: LEAVE,
			payload: {
				hangUp: true,
			},
		});
	};
}

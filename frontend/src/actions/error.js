/* @flow */
import type { Action } from '../types/action';

export const ERROR = 'ERROR';

export function setError(message: ?string) {
	return (dispatch: (action: Action) => Action) => {
		dispatch({
			type: ERROR,
			payload: {
				message,
			},
		});
	};
}

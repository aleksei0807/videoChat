// @flow
import type { Action } from '../types/action';
import { loginEnd, logoutEnd } from './user';
import { handleOffer, handleAnswer, handleCandidate, handleLeave, errorHandler } from './call';

export const CONNECTION = 'CONNECTION';
let conn = null;

function handler(data, dispatch, getStore) {
	switch (data.type) {
	case 'login': {
		loginEnd(data.success)(dispatch);
		break;
	}
	case 'logout': {
		logoutEnd(data.success)(dispatch);
		break;
	}
	case 'offer':
		handleOffer(data.offer, data.name)(dispatch, getStore);
		break;
	case 'answer':
		handleAnswer(data.answer);
		break;
	case 'candidate':
		handleCandidate(data.candidate);
		break;
	case 'leave':
		handleLeave()(dispatch, getStore);
		break;
	case 'error':
		errorHandler(data)(dispatch, getStore);
		break;
	default:
		break;
	}
}

export function connection() {
	return (dispatch: (action: Action) => Action, getStore: Function) => {
		conn = new WebSocket('wss://127.0.0.1:9090');

		conn.onopen = () => {
			console.log('Connected to the signaling server');
			dispatch({
				type: CONNECTION,
			});
		};

		conn.onmessage = (msg) => {
			console.log('Got message', msg.data);

			let data = {
				type: '',
			};
			if (typeof msg.data === 'string') {
				data = JSON.parse(msg.data);
			} else if (msg.data instanceof ArrayBuffer) {
				data = JSON.parse(String.fromCharCode.apply(null, Array(msg.data)));
			}

			handler(data, dispatch, getStore);
		};

		conn.onerror = (err) => {
			console.log('Got error', err);
		};
	};
}

export function send(msg: Object) {
	return (dispatch: (action: Action) => Action, getStore: Function) => {
		const message = msg;
		const connectedUser = getStore().call.email;
		if (connectedUser) {
			message.name = connectedUser;
		}
		if (conn) {
			conn.send(JSON.stringify(message));
		}
	};
}

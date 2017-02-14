/* @flow */
import { call, put, select, take, fork } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { backend } from '../../../config.json';
import { CONNECTION_SUCCESS, SEND } from '../actions/connection';
import { LOGIN_SUCCESS, LOGIN_ERROR, LOGOUT } from '../actions/user';
import { CHANGE_LOCAL_VIDEO } from '../actions/video';
import {
	LEAVE,
	CALL,
	HANDLE_ANSWER,
	HANDLE_CANDIDATE,
	HANDLE_ERROR,
	END_LEAVE } from '../actions/call';
import { ERROR } from '../actions/error';

import type { Saga } from '../types/saga';

const onOpen = conn => eventChannel(emit => {
	const myConn = conn;
	myConn.onopen = () => {
		emit({
			type: CONNECTION_SUCCESS,
		});
	};
	myConn.onerror = () => {
		emit({
			type: ERROR,
			payload: {
				message: 'Connection error',
			},
		});
	};
	return () => {
		console.log('unsubscribe');
	};
});

const onMessage = conn => eventChannel(emit => {
	const myConn = conn;
	myConn.onmessage = (msg) => {
		console.log('Got message', msg.data);

		let data = {
			type: '',
		};
		if (typeof msg.data === 'string') {
			data = JSON.parse(msg.data);
		} else if (msg.data instanceof ArrayBuffer) {
			data = JSON.parse(String.fromCharCode.apply(null, Array(msg.data)));
		}

		emit(data);
	};
	return () => {
		console.log('unsubscribe');
	};
});

const getUserEmail = state => state.call.email;

function* send(conn): Saga {
	while (true) {
		const action = yield take(SEND);
		const connectedUser = yield select(getUserEmail);
		const message = action.payload;
		if (connectedUser && message.type !== 'logout' && message.type !== 'login') {
			message.email = connectedUser;
		}
		if (conn) {
			conn.send(JSON.stringify(message));
		}
	}
}

function* messageHandler(conn): Saga {
	const messageAction = yield call(onMessage, conn);
	while (true) {
		const data = yield take(messageAction);
		if (data && data.type) {
			switch (data.type) {
			case 'logout': {
				if (data.success) {
					yield put({
						type: CHANGE_LOCAL_VIDEO,
						payload: {
							video: null,
						},
					});
					yield put({
						type: LEAVE,
					});
					yield put({
						type: LOGOUT,
					});
					yield put({
						type: ERROR,
						payload: {
							message: null,
						},
					});
				} else {
					yield put({
						type: ERROR,
						payload: {
							message: 'Logout error',
						},
					});
				}
				break;
			}
			case 'login': {
				if (data.success) {
					yield put({
						type: LOGIN_SUCCESS,
					});
				} else {
					yield put({
						type: LOGIN_ERROR,
					});
				}
				break;
			}
			case 'offer':
				yield put({
					type: CALL,
					payload: {
						email: data.email,
						offer: data.offer,
					},
				});
				break;
			case 'answer':
				yield put({
					type: HANDLE_ANSWER,
					payload: {
						answer: data.answer,
					},
				});
				break;
			case 'candidate':
				yield put({
					type: HANDLE_CANDIDATE,
					payload: {
						candidate: data.candidate,
					},
				});
				break;
			case 'leave':
				yield put({
					type: END_LEAVE,
				});
				break;
			case 'error':
				yield put({
					type: HANDLE_ERROR,
					payload: data,
				});
				break;
			default:
				break;
			}
		}
	}
}

export default function* connection(): Saga {
	const conn = new WebSocket(`wss://${backend.host}:${backend.port}`);

	yield fork(send, conn);
	yield fork(messageHandler, conn);

	const openAction = yield call(onOpen, conn);
	const action = yield take(openAction);
	yield put(action);
}

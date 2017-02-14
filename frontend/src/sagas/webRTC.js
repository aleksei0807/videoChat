/* @flow */
import { eventChannel } from 'redux-saga';
import { take, put, fork, call } from 'redux-saga/effects';
import {
	HANDLE_OFFER,
	CALL,
	HANDLE_ANSWER,
	CALL_COMPLIETED,
	HANDLE_CANDIDATE,
	ADD_CANDIDATE,
	LEAVE,
	END_LEAVE,
	HANDLE_ERROR } from '../actions/call';
import { ERROR } from '../actions/error';
import { CHANGE_REMOTE_VIDEO } from '../actions/video';
import { SEND } from '../actions/connection';
import { PeerConnection, configuration } from '../utils/webrtc';

import type { MediaStreamType } from '../types/mediaStream';
import type { Saga } from '../types/saga';

const errorHandler = (message) => ({
	type: ERROR,
	payload: {
		message,
	},
});

const peerConnectionError = errorHandler('Your browser doesn\'t support webRTC');

function changeRemoteVideo(stream: MediaStreamType) {
	const remoteVideo = window.URL.createObjectURL(stream);
	return {
		type: CHANGE_REMOTE_VIDEO,
		payload: {
			video: remoteVideo,
		},
	};
}

const onStream = conn => eventChannel(emit => {
	const myConn = conn;
	if (myConn.ontrack !== undefined) {
		myConn.ontrack = (e) => {
			emit(changeRemoteVideo(e.streams[0]));
		};
	} else {
		myConn.onaddstream = (e) => {
			emit(changeRemoteVideo(e.stream));
		};
	}
	return () => {
		console.log('unsubscribe');
	};
});

function* onStreamAction(conn): Saga {
	const action = yield call(onStream, conn);
	while (true) {
		const reduxAction = yield take(action);
		yield put(reduxAction);
	}
}

const onIceCandidate = conn => eventChannel(emit => {
	const myConn = conn;
	myConn.onicecandidate = (event) => {
		if (event.candidate) {
			emit({
				type: 'candidate',
				candidate: event.candidate,
			});
		}
	};
	return () => {
		console.log('unsubscribe');
	};
});

function* candidateAction(conn): Saga {
	const action = yield call(onIceCandidate, conn);
	while (true) {
		const payload = yield take(action);
		yield put({
			type: SEND,
			payload,
		});
	}
}

function* handleOffer(conn): Saga {
	try {
		while (true) {
			yield take(HANDLE_OFFER);
			const offer = yield conn.createOffer();
			conn.setLocalDescription(offer);
			yield put({
				type: SEND,
				payload: {
					type: 'offer',
					offer,
				},
			});
		}
	} catch (e) {
		console.error(e);
		yield put(errorHandler('Error when creating an offer'));
	}
}

function* handleCall(conn): Saga {
	try {
		while (true) {
			const { payload: { offer } } = yield take(CALL);
			conn.setRemoteDescription(new window.RTCSessionDescription(offer));
			const answer = yield conn.createAnswer();
			conn.setLocalDescription(answer);
			yield put({
				type: SEND,
				payload: {
					type: 'answer',
					answer,
				},
			});
		}
	} catch (e) {
		console.error(e);
		yield put(errorHandler('Error when creating an answer'));
	}
}

function* handleAnswer(conn): Saga {
	while (true) {
		const { payload: { answer } } = yield take(HANDLE_ANSWER);
		conn.setRemoteDescription(new window.RTCSessionDescription(answer));
		yield put({
			type: CALL_COMPLIETED,
		});
	}
}

function* handleCandidate(conn): Saga {
	while (true) {
		const { payload: { candidate } } = yield take(HANDLE_CANDIDATE);
		yield conn.addIceCandidate(new window.RTCIceCandidate(candidate));
		yield put({
			type: ADD_CANDIDATE,
		});
	}
}

function* handleError(): Saga {
	while (true) {
		const { payload: error } = yield take(HANDLE_ERROR);
		if (error.errorType === 'offer') {
			yield put({
				type: LEAVE,
			});
			yield put(errorHandler(error.message));
		}
	}
}

function* handleLeave(conn): Saga {
	try {
		while (true) {
			const action = yield take(LEAVE);
			if (typeof conn.getReceivers === 'function') {
				const tracks = conn.getReceivers();
				tracks.forEach(track => {
					if (typeof track.stop === 'function') {
						track.stop();
					}
				});
			} else {
				const tracks = conn.getRemoteStreams();
				tracks.forEach(track => {
					if (typeof track.stop === 'function') {
						track.stop();
					}
				});
			}
			conn.close();
			yield put({
				type: SEND,
				payload: {
					type: 'leave',
				},
			});
			if (action && action.payload && action.payload.hangUp) {
				yield put({
					type: END_LEAVE,
				});
			}
		}
	} catch (e) {
		console.error(e);
		yield put(errorHandler('Leave error'));
	}
}

export default function* peerConnection(stream: MediaStreamType): Saga {
	try {
		const conn = new PeerConnection(configuration);
		conn.addStream(stream);
		yield fork(onStreamAction, conn);
		yield fork(candidateAction, conn);
		yield fork(handleOffer, conn);
		yield fork(handleCall, conn);
		yield fork(handleAnswer, conn);
		yield fork(handleCandidate, conn);
		yield fork(handleError);
		yield fork(handleLeave, conn);
	} catch (e) {
		yield peerConnectionError;
	}
}

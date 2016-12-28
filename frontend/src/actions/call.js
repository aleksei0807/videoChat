// @flow
import 'babel-core/register';
import 'babel-polyfill';
import type { Action } from '../types/action';
import { send } from './connection';
import { PeerConnection, configuration } from '../utils/webrtc';

/* eslint-disable no-unused-vars */
let yourConn = null;
let promise = null;
let myStream = null;
let myOnaddstream = null;
/* eslint-enable no-unused-vars */

export const LEAVE = 'LEAVE';
export const END_LEAVE = 'END_LEAVE';
export const CALL = 'CALL';
export const HANDLE_OFFER = 'HANDLE_OFFER';
export const ERROR = 'ERROR';
export const CHANGE_LOCAL_VIDEO = 'CHANGE_LOCAL_VIDEO';
export const CHANGE_REMOTE_VIDEO = 'CHANGE_REMOTE_VIDEO';

export function peerConnection(
	stream: Object,
	onaddstream: Function
) {
	return (dispatch: (action: Action) => Action, getStore: Function) => {
		if (!PeerConnection) {
			dispatch({
				type: ERROR,
				error: {
					message: 'Your browser doesn\'t support WebRTC',
				},
			});
			return;
		}
		myStream = stream;
		myOnaddstream = onaddstream;
		yourConn = new PeerConnection(configuration);

		yourConn.addStream(stream);

		if (yourConn.ontrack !== undefined) {
			yourConn.ontrack = (e) => {
				onaddstream(e.streams[0]);
			};
		} else {
			yourConn.onaddstream = (e) => {
				onaddstream(e.stream);
			};
		}

		yourConn.onicecandidate = (event) => {
			if (event.candidate) {
				send({
					type: 'candidate',
					candidate: event.candidate,
				})(dispatch, getStore);
			}
		};
	};
}

async function asyncCall(callToUsername, dispatch, getStore) {
	try {
		if (!yourConn) {
			if (!myStream || !myOnaddstream) {
				throw new Error('myStream or myOnaddstream is not defined!');
			}
			peerConnection(
				myStream,
				myOnaddstream
			)(dispatch, getStore);
		}

		if (yourConn) {
			dispatch({
				type: HANDLE_OFFER,
				payload: {
					email: callToUsername,
				},
			});

			const offer = await yourConn.createOffer();

			send({
				type: 'offer',
				offer,
			})(dispatch, getStore);

			yourConn.setLocalDescription(offer);
		} else {
			throw new Error('yourConn is not defined');
		}
	} catch (e) {
		dispatch({
			type: ERROR,
			error: {
				message: 'Error when creating an offer',
			},
		});
		console.error(e);
	}
}

export function call(callToUsername: string) {
	return (dispatch: (action: Action) => Action, getStore: Function) => {
		if (callToUsername.length > 0) {
			asyncCall(callToUsername, dispatch, getStore);
		}
	};
}

async function handleOfferAsync(offer, resolve, dispatch, getStore) {
	try {
		if (yourConn) {
			await yourConn.setRemoteDescription(new window.RTCSessionDescription(offer));

			const answer = await yourConn.createAnswer();

			await yourConn.setLocalDescription(answer);

			resolve();
			promise = null;

			send({
				type: 'answer',
				answer,
			})(dispatch, getStore);
		} else {
			throw new Error('yourConn is not defined');
		}
	} catch (e) {
		dispatch({
			type: ERROR,
			error: {
				message: 'Error when creating an answer',
			},
		});
	}
}

export function handleOffer(offer: Object, name: string) {
	return (dispatch: (action: Action) => Action, getStore: Function) => {
		if (!yourConn) {
			if (!myStream || !myOnaddstream) {
				console.error('myStream or myOnaddstream is not defined!');
				return;
			}
			peerConnection(
				myStream,
				myOnaddstream
			)(dispatch, getStore);
		}
		dispatch({
			type: CALL,
			payload: {
				email: name,
			},
		});
		promise = new Promise((resolve) => {
			handleOfferAsync(offer, resolve, dispatch, getStore);
		});
	};
}

async function handleAnswerAsync(answer, resolve, reject) {
	try {
		if (yourConn) {
			await yourConn.setRemoteDescription(new window.RTCSessionDescription(answer));
			resolve();
			promise = null;
		} else {
			throw new Error('yourConn is not defined');
		}
	} catch (e) {
		console.error(e);
		reject();
		promise = null;
	}
}

export async function handleAnswer(answer: Object) {
	if (yourConn) {
		if (promise) {
			await promise;
		}
		promise = new Promise((resolve, reject) => {
			handleAnswerAsync(answer, resolve, reject);
		});
	}
}

export async function handleCandidate(candidate: Object) {
	if (yourConn && candidate) {
		if (promise) {
			await promise;
		}
		promise = new Promise((resolve, reject) => {
			try {
				if (yourConn) {
					yourConn.addIceCandidate(new window.RTCIceCandidate(candidate));
					resolve();
					promise = null;
				} else {
					throw new Error('yourConn is not defined');
				}
			} catch (e) {
				console.error(e);
				reject();
				promise = null;
			}
		});
	}
}

export function handleLeave() {
	return (dispatch: (action: Action) => Action) => {
		dispatch({
			type: LEAVE,
		});
		if (yourConn) {
			yourConn.close();
			yourConn = null;
		}
	};
}

export function errorHandler(error: Object) {
	return (dispatch: (action: Action) => Action) => {
		if (error.errorType === 'offer') {
			dispatch({
				type: LEAVE,
			});
			if (yourConn) {
				yourConn.close();
				yourConn = null;
			}
		}
	};
}

export function changeLocalVideo(localVideo: string) {
	return (dispatch: (action: Action) => Action) => {
		dispatch({
			type: CHANGE_LOCAL_VIDEO,
			payload: {
				video: localVideo,
			},
		});
	};
}

export function changeRemoteVideo(remoteVideo: string) {
	return (dispatch: (action: Action) => Action) => {
		dispatch({
			type: CHANGE_REMOTE_VIDEO,
			payload: {
				video: remoteVideo,
			},
		});
	};
}

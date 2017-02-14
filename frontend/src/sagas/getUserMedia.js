/* @flow */
import { call, put, fork, take } from 'redux-saga/effects';
import { ERROR } from '../actions/error';
import peerConnection from './webRTC';
import { CHANGE_LOCAL_VIDEO } from '../actions/video';
import getUserMediaPolyfill from '../utils/getUserMedia';

import type { MediaStreamType } from '../types/mediaStream';
import type { Saga } from '../types/saga';

getUserMediaPolyfill(); // Polyfill
let mediaDevices = () => {
	console.error('navigator.mediaDevices or navigator.mediaDevices.getUserMedia not found');
};
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
	mediaDevices = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
}

function changeLocalVideo(stream: MediaStreamType) {
	const localVideo = window.URL.createObjectURL(stream);
	return {
		type: CHANGE_LOCAL_VIDEO,
		payload: {
			video: localVideo,
		},
	};
}

const userMediaError = () => ({
	type: ERROR,
	payload: {
		message: 'Your browser doesn\'t support Media Devices API',
	},
});

function* clearLocalVideo(stream: MediaStreamType) {
	while (true) {
		const { payload: { video } } = yield take(CHANGE_LOCAL_VIDEO);
		if (video === null) {
			const tracks = stream.getTracks();
			if (tracks) {
				tracks.forEach(track => {
					if (typeof track.stop === 'function') {
						track.stop();
					}
				});
			} else if (typeof stream.stop === 'function') {
				stream.stop();
			}
		}
	}
}

export default function* getUserMedia(): Saga {
	try {
		const stream = yield call(mediaDevices, {
			audio: true,
			video: true,
		});
		if (stream) {
			yield put(changeLocalVideo(stream));
			yield fork(peerConnection, stream);
			yield fork(clearLocalVideo, stream);
		}
	} catch (e) {
		yield put(userMediaError());
	}
}

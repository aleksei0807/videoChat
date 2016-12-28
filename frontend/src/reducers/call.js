// @flow
import type { Action } from '../types/action';
import {
	LEAVE,
	CALL,
	HANDLE_OFFER,
	CHANGE_LOCAL_VIDEO,
	CHANGE_REMOTE_VIDEO,
} from '../actions/call';

const defaultState = {
	leave: false,
	email: null,
	error: false,
	localVideo: null,
	remoteVideo: null,
};

export default function general(state: Object = defaultState, action: Action) {
	switch (action.type) {
	case LEAVE:
		return {...state, ...{ leave: true, email: null, error: false, remoteVideo: null } };
	case CALL: {
		if (action.payload) {
			return {...state, ...{ email: action.payload.email, error: false } };
		}
		return state;
	}
	case HANDLE_OFFER: {
		if (action.payload) {
			return {...state, ...{ email: action.payload.email, error: false } };
		}
		return state;
	}
	case CHANGE_LOCAL_VIDEO: {
		if (action.payload) {
			return {...state, ...{ localVideo: action.payload.video } };
		}
		return state;
	}
	case CHANGE_REMOTE_VIDEO: {
		if (action.payload) {
			return {...state, ...{ remoteVideo: action.payload.video } };
		}
		return state;
	}
	default:
		return state;
	}
}

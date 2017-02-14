/* @flow */
import type { Action } from '../types/action';
import {
	CHANGE_LOCAL_VIDEO,
	CHANGE_REMOTE_VIDEO,
} from '../actions/video';
import { END_LEAVE } from '../actions/call';

const defaultState = {
	localVideo: null,
	remoteVideo: null,
};

export default function general(state: Object = defaultState, action: Action) {
	switch (action.type) {
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
	case END_LEAVE: {
		return {...state, ...{ remoteVideo: null } };
	}
	default:
		return state;
	}
}

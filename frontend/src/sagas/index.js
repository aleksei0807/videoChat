/* @flow */
import { takeEvery } from 'redux-saga/effects';
import getUserMedia from './getUserMedia';
import connection from './ws';
import { LOGIN_SUCCESS } from '../actions/user';
import { CONNECTION_START } from '../actions/connection';
import { END_LEAVE } from '../actions/call';

import type { Saga } from '../types/saga';

export default function* saga(): Saga {
	yield takeEvery(LOGIN_SUCCESS, getUserMedia);
	yield takeEvery(END_LEAVE, getUserMedia);
	yield takeEvery(CONNECTION_START, connection);
}

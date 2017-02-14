/* eslint-disable import/prefer-default-export */
import type { IterableIterator, ForkEffect } from 'redux-saga';

export type Saga = IterableIterator<ForkEffect>;

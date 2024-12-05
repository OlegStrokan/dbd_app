import { monotonicFactory } from 'ulid';
import { Ulid } from './types';

export const generateUlid: () => Ulid = monotonicFactory();

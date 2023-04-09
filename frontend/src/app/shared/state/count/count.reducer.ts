import { createReducer, on } from '@ngrx/store';
import { decrementBy, incrementBy } from './count.actions';

export const initialState: Readonly<number> = 0;

export const countReducer = createReducer(
  initialState,
  on(incrementBy, (state, { count }) => {
    return state + count;
  }),
  on(decrementBy, (state, { count }) => {
    return state - count;
  })
);

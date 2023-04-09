import { createAction, props } from '@ngrx/store';

export const incrementBy = createAction(
  '[Count API] Increment By',
  props<{ count: number }>()
);

export const decrementBy = createAction(
  '[Count API] Decrement By',
  props<{ count: number }>()
);

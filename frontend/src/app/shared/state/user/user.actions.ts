import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/core/api/user';

export const registerAction = createAction(
  '[User] Register',
  props<{ user: User }>()
);

export const loginAction = createAction(
  '[User] Login',
  props<{ user: User }>()
);

export const updateAction = createAction(
  '[User] Update',
  props<{ user: User }>()
);

import { createReducer, on } from '@ngrx/store';
import { User } from 'src/app/core/api/user';
import { loginAction, registerAction, updateAction } from './user.actions';

export const initialState: Readonly<User> = {};

export const userReducer = createReducer(
  initialState,
  on(registerAction, (state, { user }) => {
    return { ...state, ...user };
  }),
  on(loginAction, (state, { user }) => {
    return { ...state, ...user };
  }),
  on(updateAction, (state, { user }) => {
    return { ...state, ...user };
  })
);

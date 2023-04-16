import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { userReducer } from './shared/state/user/user.reducer';

export const appReducer: ActionReducerMap<AppState, any> = {
  user: userReducer,
};

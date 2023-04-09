import { ActionReducerMap, createReducer } from '@ngrx/store';
import { AppState } from './app.state';
import { countReducer } from './shared/state/count/count.reducer';

export const appReducer: ActionReducerMap<AppState, any> = {
  count: countReducer,
};

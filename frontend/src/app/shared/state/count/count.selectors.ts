import { createSelector } from '@ngrx/store';
import { appStateSelector } from 'src/app/app.selector';

export const count = createSelector(appStateSelector, (state) => state.count);

import { inject } from '@angular/core';
import { map, catchError, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loginAction } from 'src/app/shared/state/user/user.actions';
import { User } from '../api/user';

export const authGuard = () => {
  const authService = inject(AuthService);
  if (authService.loggedIn) {
    return true;
  }

  const router = inject(Router);

  const store = inject(Store);

  return authService.checkClientHasToken().pipe(
    map((res: User) => {
      store.dispatch(loginAction({ user: res }));
      authService.loggedIn = true;
      return true;
    }),
    catchError(() => {
      return router.navigateByUrl('/auth');
    })
  );
};

export const authPageGuard = () => {
  const authService = inject(AuthService);
  if (authService.loggedIn) {
    return false;
  }

  return true;
};

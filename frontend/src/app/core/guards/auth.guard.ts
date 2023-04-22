import { inject } from '@angular/core';
import { map, catchError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authGuard = () => {
  const authService = inject(AuthService);
  if (authService.loggedIn) {
    return true;
  }

  const router = inject(Router);

  return authService.checkClientHasToken().pipe(
    map(() => {
      authService.loggedIn = true;
      return true;
    }),
    catchError(() => {
      return router.navigateByUrl('/auth');
    })
  );
};

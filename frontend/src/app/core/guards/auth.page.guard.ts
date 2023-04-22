import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authPageGuard = () => {
  const authService = inject(AuthService);
  if (!authService.loggedIn) {
    return true;
  }
  const router = inject(Router);
  return router.navigate(['', 'home']);
};

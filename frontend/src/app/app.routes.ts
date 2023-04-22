import { Routes } from '@angular/router';
import { authPageGuard } from './core/guards/auth.page.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [authPageGuard],
    loadComponent: () =>
      import('./core/pages/auth/auth.page').then((m) => m.AuthPage),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/pages/user-detail/user-detail.page').then(
        (m) => m.UserDetailPage
      ),
  },
  {
    path: 'profile-update',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/pages/user-update/user-update.page').then(
        (m) => m.UserUpdatePage
      ),
  },
];

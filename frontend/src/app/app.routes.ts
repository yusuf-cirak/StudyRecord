import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthPageGuard } from './core/guards/auth-page.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [AuthPageGuard],
    loadComponent: () =>
      import('./core/pages/auth/auth.page').then((m) => m.AuthPage),
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./core/pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./core/pages/user-detail/user-detail.page').then(
        (m) => m.UserDetailPage
      ),
  },
  {
    path: 'profile-update',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./core/pages/user-update/user-update.page').then(
        (m) => m.UserUpdatePage
      ),
  },
];

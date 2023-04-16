import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./core/pages/auth/auth.page').then((m) => m.AuthPage),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./core/pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./core/pages/user-detail/user-detail.page').then(
        (m) => m.UserDetailPage
      ),
  },
  {
    path: 'profile-update',
    loadComponent: () =>
      import('./core/pages/user-update/user-update.page').then(
        (m) => m.UserUpdatePage
      ),
  },
];

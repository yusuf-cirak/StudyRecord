import { Lesson } from './core/api/lesson';
import { Routes } from '@angular/router';
import { BookResolver } from './core/resolvers/book.resolver';
import { BookListResolver } from './core/resolvers/book-list.resolver';
import { LessonResolver } from './core/resolvers/lesson.resolver';
import { LessonListResolver } from './core/resolvers/lesson-list.resolver';
import { authPageGuard, authGuard } from './core/guards/guards';
import { LessonProblemSolveListResolver } from './core/resolvers/lesson-problem-solve-list.resolver';
import { LessonProblemSolveResolver } from './core/resolvers/lesson-problem-solve.resolver';

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
      import('./core/pages/user/user-detail/user-detail.page').then(
        (m) => m.UserDetailPage
      ),
  },
  {
    path: 'profile-update',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/pages/user/user-update/user-update.page').then(
        (m) => m.UserUpdatePage
      ),
  },
  {
    path: 'book-list',
    canActivate: [authGuard],
    resolve: {
      books: BookListResolver,
    },
    loadComponent: () =>
      import('./core/pages/book/book-list/book-list.page').then(
        (m) => m.BookListPage
      ),
  },
  {
    path: 'book-show',
    loadComponent: () =>
      import('./core/pages/book/book-show/book-show.page').then(
        (m) => m.BookShowPage
      ),
  },
  {
    path: 'book-show/:id',
    canActivate: [authGuard],
    resolve: {
      book: BookResolver,
    },
    loadComponent: () =>
      import('./core/pages/book/book-show/book-show.page').then(
        (m) => m.BookShowPage
      ),
  },
  {
    path: 'lesson-list',
    canActivate: [authGuard],
    resolve: {
      lessons: LessonListResolver,
    },
    loadComponent: () =>
      import('./core/pages/lesson/lesson-list/lesson-list.page').then(
        (m) => m.LessonListPage
      ),
  },
  {
    path: 'lesson-show',
    loadComponent: () =>
      import('./core/pages/lesson/lesson-show/lesson-show.page').then(
        (m) => m.LessonShowPage
      ),
  },
  {
    path: 'lesson-show/:id',
    canActivate: [authGuard],
    resolve: {
      lesson: LessonResolver,
    },
    loadComponent: () =>
      import('./core/pages/lesson/lesson-show/lesson-show.page').then(
        (m) => m.LessonShowPage
      ),
  },
  {
    path: 'lesson-problem-solve-list',
    canActivate: [authGuard],
    resolve: {
      lessons: LessonListResolver,
      lessonProblemSolves: LessonProblemSolveListResolver,
    },

    loadComponent: () =>
      import(
        './core/pages/lesson-problem-solve/lesson-problem-solve-list/lesson-problem-solve-list.page'
      ).then((m) => m.LessonProblemSolveListPage),
  },
  {
    path: 'lesson-problem-solve-show',
    canActivate: [authGuard],
    resolve: {
      lessons: LessonListResolver,
    },
    loadComponent: () =>
      import(
        './core/pages/lesson-problem-solve/lesson-problem-solve-show/lesson-problem-solve-show.page'
      ).then((m) => m.LessonProblemSolveShowPage),
  },
  {
    path: 'lesson-problem-solve-show/:id',
    canActivate: [authGuard],
    resolve: {
      lessons: LessonListResolver,
      lessonProblemSolve: LessonProblemSolveResolver,
    },
    loadComponent: () =>
      import(
        './core/pages/lesson-problem-solve/lesson-problem-solve-show/lesson-problem-solve-show.page'
      ).then((m) => m.LessonProblemSolveShowPage),
  },
  {
    path: 'lesson-problem-solve-chart',
    loadComponent: () =>
      import(
        './core/pages/lesson-problem-solve/lesson-problem-solve-chart/lesson-problem-solve-chart.page'
      ).then((m) => m.LessonProblemSolveChartPage),
  },
];

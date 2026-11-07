import { Routes } from '@angular/router';
import { authGuard, publicGuard, roleGuard } from './Core/Guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./Layouts/public-layout/public-layout').then((m) => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./Pages/Home/views/home-view/home-view').then((m) => m.HomeViewComponent),
        title: 'ViajeDirecto · Viajes que se sienten tuyos',
      },
      {
        path: 'tours',
        loadComponent: () =>
          import('./Pages/Tours/views/list-view/list-view').then((m) => m.TourListViewComponent),
        title: 'Tours · ViajeDirecto',
      },
      {
        path: 'tours/:id',
        loadComponent: () =>
          import('./Pages/Tours/views/detail-view/detail-view').then(
            (m) => m.TourDetailViewComponent,
          ),
        title: 'Detalle del tour · ViajeDirecto',
      },
      {
        path: 'express',
        loadComponent: () =>
          import('./Pages/Express/views/express-view/express-view').then(
            (m) => m.ExpressViewComponent,
          ),
        title: 'Escapadas Express · ViajeDirecto',
      },
      {
        path: 'calendario',
        loadComponent: () =>
          import('./Pages/Calendar/views/calendar-view/calendar-view').then(
            (m) => m.CalendarViewComponent,
          ),
        title: 'Calendario de salidas · ViajeDirecto',
      },
      {
        path: 'nosotros',
        loadComponent: () =>
          import('./Pages/About/views/about-view/about-view').then((m) => m.AboutViewComponent),
        title: 'Nosotros · ViajeDirecto',
      },
    ],
  },
  {
    path: 'login',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./Layouts/auth-layout/auth-layout').then((m) => m.AuthLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./Pages/Login/views/login-view/login-view').then((m) => m.LoginViewComponent),
        title: 'Acceso al panel · ViajeDirecto',
      },
    ],
  },
  {
    path: 'panel',
    canActivate: [authGuard, roleGuard(['owner', 'editor'])],
    loadComponent: () =>
      import('./Layouts/panel-layout/panel-layout').then((m) => m.PanelLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./Pages/Home/views/edit-home-view/edit-home-view').then(
            (m) => m.EditHomeViewComponent,
          ),
        title: 'Panel · ViajeDirecto',
      },
      {
        path: 'tours',
        loadComponent: () =>
          import('./Pages/Tours/views/admin-list-view/admin-list-view').then(
            (m) => m.AdminTourListViewComponent,
          ),
        title: 'Gestión de tours · ViajeDirecto',
      },
      {
        path: 'calendario',
        loadComponent: () =>
          import('./Pages/Calendar/views/admin-calendar-view/admin-calendar-view').then(
            (m) => m.AdminCalendarViewComponent,
          ),
        title: 'Gestión de calendario · ViajeDirecto',
      },
      {
        path: 'nosotros',
        loadComponent: () =>
          import('./Pages/About/views/edit-about-view/edit-about-view').then(
            (m) => m.EditAboutViewComponent,
          ),
        title: 'Editar Nosotros · ViajeDirecto',
      },
      {
        path: 'usuarios',
        canActivate: [roleGuard(['owner'])],
        loadComponent: () =>
          import('./Pages/Users/views/users-view/users-view').then((m) => m.UsersViewComponent),
        title: 'Gestión de usuarios · ViajeDirecto',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

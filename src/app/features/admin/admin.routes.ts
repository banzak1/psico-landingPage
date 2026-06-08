import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'patients',
        loadComponent: () => import('./pages/patients/patients.component').then(m => m.PatientsComponent)
      },
      {
        path: 'sessions',
        loadComponent: () => import('./pages/sessions/sessions.component').then(m => m.SessionsComponent)
      }
    ]
  }
];

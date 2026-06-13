import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    /* webpackChunkName: "admin" */
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  }
];

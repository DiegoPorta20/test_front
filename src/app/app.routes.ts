import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./components/notifications/notifications.component').then(m => m.NotificationsComponent)
  },
  {
    path: 's3',
    loadComponent: () => import('./components/s3/s3.component').then(m => m.S3Component)
  },
  {
    path: 'sqs',
    loadComponent: () => import('./components/sqs/sqs.component').then(m => m.SqsComponent)
  },
  {
    path: 'ses',
    loadComponent: () => import('./components/ses/ses.component').then(m => m.SesComponent)
  }
];

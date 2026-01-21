
import { Routes } from '@angular/router';
import { AuthGuard, NoAuthGuard } from '@core/guards';
import { AuthLayoutComponent } from '@auth/layouts/auth-layout/auth-layout.component';
import {
  LoginPageComponent,
} from '@auth/components/containers';

export default [
  {
    path: 'auth',
    canActivate: [NoAuthGuard],
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginPageComponent,
      },
    ],
  },
  {
    path: 'logout',
    canActivate: [AuthGuard],
    component: LogoutPageComponent,
  },
] as Routes;

import {
  NgModule
} from '@angular/core';

import {
  RouterModule,
  Routes
} from '@angular/router';

import {
  AuthGuard
} from '@app/shared/guards';

import { DeleteComponent } from './delete/delete.component';
import { ForgottenComponent } from './forgotten/forgotten.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SettingsComponent } from './settings/settings.component';
import { VerifyAccountComponent } from './verify/verify.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule'
  },
  {
    path: 'forgotten',
    component: ForgottenComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'reset-password/:resetPasswordToken',
    component: ResetPasswordComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'verify/:emailAddressVerificationToken',
    component: VerifyAccountComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'verify',
    component: VerifyAccountComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'delete',
    component: DeleteComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuard
  ]
})
export class AccountRoutingModule { }

import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ReactiveFormsModule
} from '@angular/forms';

import {
  FormFieldModule
} from '../../modules/form-field';

import {
  GridModule
} from '../../modules/grid';

import {
  HideUntilModule
} from '../../modules/hide-until';

import {
  NoticeModule
} from '../../modules/notice';

import {
  PasswordViewerModule
} from '../../modules/password-viewer';

import { AccountRoutingModule } from './account-routing.module';
import { AccountService } from './account.service';
import { DeleteComponent } from './delete/delete.component';
import { ForgottenComponent } from './forgotten/forgotten.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SettingsComponent } from './settings/settings.component';
import { VerifyAccountComponent } from './verify/verify.component';

@NgModule({
  imports: [
    AccountRoutingModule,
    CommonModule,
    FormFieldModule,
    GridModule,
    HideUntilModule,
    NoticeModule,
    PasswordViewerModule,
    ReactiveFormsModule
  ],
  declarations: [
    ForgottenComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    VerifyAccountComponent,
    SettingsComponent,
    DeleteComponent
  ],
  providers: [
    AccountService
  ]
})
export class AccountModule { }
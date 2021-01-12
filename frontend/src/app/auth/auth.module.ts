import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatInputModule} from "@angular/material/input";
import {ErrorStateMatcher, ShowOnDirtyErrorStateMatcher} from "@angular/material/core";
import {NgxMatFileInputModule} from "@angular-material-components/file-input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import {RouterModule} from "@angular/router";
import { ForgetComponent } from './components/forget/forget.component';
import {MatDialogModule} from "@angular/material/dialog";
import {StoreModule} from "@ngrx/store";
import {reducer} from "./store/reducers";
import {AuthService} from "./services/auth.service";
import {EffectsModule} from "@ngrx/effects";
import {RegisterEffect} from "./store/effects/register.effect";
import {BackendErrorMessagesModule} from "../shared/modules/backend-error-messages/backend-error-messages.module";
import {SuccessMessagesModule} from "../shared/modules/success-messages/success-messages.module";
import {PersistanceService} from "../shared/services/persistance.service";
import {LoginEffect} from "./store/effects/login.effect";
import {GetCurrentUserEffect} from "./store/effects/getCurrentUser.effect";
import {ContactsModule} from "../shared/modules/contacts/contacts.module";
import {LogoutEffect} from "./store/effects/logout.effect";

@NgModule({
  declarations: [RegisterComponent, LoginComponent, ForgetComponent],
  imports: [
    CommonModule,
    MatInputModule,
    NgxMatFileInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    StoreModule.forFeature('auth', reducer),
    EffectsModule.forFeature([
      RegisterEffect,
      LoginEffect,
      GetCurrentUserEffect,
      LogoutEffect
    ]),
    BackendErrorMessagesModule,
    SuccessMessagesModule,
    ContactsModule
  ],
  providers: [
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
    AuthService,
    PersistanceService
  ]
})
export class AuthModule { }

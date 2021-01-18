import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';
import {RouterModule, Routes} from "@angular/router";
import {RegisterComponent} from "../../auth/components/register/register.component";
import {MatTabsModule} from "@angular/material/tabs";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LoginComponent} from "../../auth/components/login/login.component";
import {MatCardModule} from "@angular/material/card";
import {GuestGuard} from "../guards/guest.guard";
import {BackendErrorMessagesModule} from "../modules/backend-error-messages/backend-error-messages.module";
import {SuccessMessagesModule} from "../modules/success-messages/success-messages.module";

const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, canActivate: [GuestGuard], children: [
      {path: '', redirectTo: '/login', pathMatch: 'full'},
      {path: 'login', component: LoginComponent, data: {page: 'login'}},
      {path: 'register', component: RegisterComponent, data: {page: 'register'}}
    ]
  }
]

@NgModule({
  declarations: [AuthLayoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BrowserAnimationsModule,
    MatTabsModule,
    MatCardModule,
    BackendErrorMessagesModule,
    SuccessMessagesModule
  ]
})
export class AuthLayoutModule { }

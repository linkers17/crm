import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';
import {RouterModule, Routes} from "@angular/router";
import {RegisterComponent} from "../../auth/components/register/register.component";

const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      {path: '', redirectTo: '/register', pathMatch: 'full'},
      {path: 'register', component: RegisterComponent}
    ]
  }
]

@NgModule({
  declarations: [AuthLayoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthLayoutModule { }

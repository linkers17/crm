import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { SiteLayoutComponent } from './components/site-layout/site-layout.component';
import {AuthGuard} from "../guards/auth.guard";

const routes: Routes = [
  {
    path: 'dashboard', component: SiteLayoutComponent, canActivate: [AuthGuard]
  }
]

@NgModule({
  declarations: [SiteLayoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class SiteLayoutModule { }

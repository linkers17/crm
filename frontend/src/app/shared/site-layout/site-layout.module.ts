import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { SiteLayoutComponent } from './components/site-layout/site-layout.component';
import {AuthGuard} from "../guards/auth.guard";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";

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
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule
  ]
})
export class SiteLayoutModule { }

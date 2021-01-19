import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';
import { MatCardModule } from '@angular/material/card';
import {RouterModule} from "@angular/router";


@NgModule({
  declarations: [DashboardPageComponent],
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule
  ]
})
export class DashboardModule { }

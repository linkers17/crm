import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportPageComponent } from './components/report-page/report-page.component';
import { ReportListComponent } from './components/report-list/report-list.component';
import {RouterModule} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatRadioModule} from "@angular/material/radio";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatButtonModule} from "@angular/material/button";
import {ChartsModule} from "ng2-charts";



@NgModule({
  declarations: [ReportPageComponent, ReportListComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatRadioModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    ChartsModule
  ]
})
export class ReportsModule { }

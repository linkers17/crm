import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerPageComponent } from './components/customer-page/customer-page.component';
import { CustomersListComponent } from './components/customers-list/customers-list.component';
import {RouterModule} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import {StoreModule} from "@ngrx/store";
import {reducer} from "./store/reducers";
import {EffectsModule} from "@ngrx/effects";
import {GetCustomersEffect} from "./store/effects/getCustomers.effect";
import {CustomersService} from "./services/customers.service";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [CustomerPageComponent, CustomersListComponent],
  imports: [
    CommonModule,
    RouterModule,
    StoreModule.forFeature('customers', reducer),
    EffectsModule.forFeature([
      GetCustomersEffect
    ]),
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    ReactiveFormsModule
  ],
  providers: [
    CustomersService
  ]
})
export class CustomersModule { }

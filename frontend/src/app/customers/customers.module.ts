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
import { CustomerComponent } from './components/customer/customer.component';
import {MatTabsModule} from "@angular/material/tabs";
import {GetCustomerByIdEffect} from "./store/effects/getCustomer.effect";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {SuccessMessagesModule} from "../shared/modules/success-messages/success-messages.module";
import {BackendErrorMessagesModule} from "../shared/modules/backend-error-messages/backend-error-messages.module";
import {RemoveCustomerEffect} from "./store/effects/removeCustomer.effect";



@NgModule({
  declarations: [CustomerPageComponent, CustomersListComponent, CustomerComponent],
  imports: [
    CommonModule,
    RouterModule,
    StoreModule.forFeature('customers', reducer),
    EffectsModule.forFeature([
      GetCustomersEffect,
      GetCustomerByIdEffect,
      RemoveCustomerEffect
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
    ReactiveFormsModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    SuccessMessagesModule,
    BackendErrorMessagesModule
  ],
  providers: [
    CustomersService
  ]
})
export class CustomersModule { }

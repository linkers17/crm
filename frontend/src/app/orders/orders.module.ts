import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { OrderPageComponent } from './components/order-page/order-page.component';
import {SuccessMessagesModule} from "../shared/modules/success-messages/success-messages.module";
import {BackendErrorMessagesModule} from "../shared/modules/backend-error-messages/backend-error-messages.module";
import {RouterModule} from "@angular/router";
import { OrderCreateComponent } from './components/order-create/order-create.component';
import {MatCardModule} from "@angular/material/card";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {StoreModule} from "@ngrx/store";
import {reducer} from "./store/reducers";
import {EffectsModule} from "@ngrx/effects";
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {GetOrdersEffect} from "./store/effects/getOrders.effect";
import {OrdersService} from "./services/orders.service";
import { OrdersListComponent } from './components/orders-list/orders-list.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {PipesModule} from "../shared/pipes/pipes.module";



@NgModule({
  declarations: [OrderPageComponent, OrderCreateComponent, OrdersListComponent],
  imports: [
    CommonModule,
    SuccessMessagesModule,
    BackendErrorMessagesModule,
    RouterModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    StoreModule.forFeature('orders', reducer),
    EffectsModule.forFeature([
      GetOrdersEffect
    ]),
    MatTableModule,
    MatIconModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatSortModule,
    PipesModule
  ],
  providers: [
    OrdersService,
    DatePipe
  ]
})
export class OrdersModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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



@NgModule({
  declarations: [OrderPageComponent, OrderCreateComponent],
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
    EffectsModule.forFeature([]),
    MatTableModule,
    MatIconModule
  ]
})
export class OrdersModule { }

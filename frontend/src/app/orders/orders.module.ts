import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderPageComponent } from './components/order-page/order-page.component';
import {SuccessMessagesModule} from "../shared/modules/success-messages/success-messages.module";
import {BackendErrorMessagesModule} from "../shared/modules/backend-error-messages/backend-error-messages.module";
import {RouterModule} from "@angular/router";
import { OrderCreateComponent } from './components/order-create/order-create.component';



@NgModule({
  declarations: [OrderPageComponent, OrderCreateComponent],
  imports: [
    CommonModule,
    SuccessMessagesModule,
    BackendErrorMessagesModule,
    RouterModule
  ]
})
export class OrdersModule { }

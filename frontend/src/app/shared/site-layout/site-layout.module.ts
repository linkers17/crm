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
import {MatTooltipModule} from "@angular/material/tooltip";
import {ContactsListComponent} from "../modules/contacts/components/contacts-list/contacts-list.component";
import {ContactComponent} from "../modules/contacts/components/contact/contact.component";
import {NotManagerGuard} from "../guards/not-manager.guard";
import {CreateContactComponent} from "../modules/contacts/components/create-contact/create-contact.component";
import {
  ContactPageComponent
} from "../modules/contacts/components/contact-page/contact-page.component";
import {DashboardPageComponent} from "../../dashboard/components/dashboard-page/dashboard-page.component";
import {DashboardModule} from "../../dashboard/dashboard.module";
import {CustomersModule} from "../../customers/customers.module";
import {CustomerPageComponent} from "../../customers/components/customer-page/customer-page.component";
import {CustomersListComponent} from "../../customers/components/customers-list/customers-list.component";
import {CustomerComponent} from "../../customers/components/customer/customer.component";
import {CustomerEditComponent} from "../../customers/components/customer-edit/customer-edit.component";
import {CustomerCreateComponent} from "../../customers/components/customer-create/customer-create.component";
import {OrderPageComponent} from "../../orders/components/order-page/order-page.component";
import {OrderCreateComponent} from "../../orders/components/order-create/order-create.component";
import {OrdersModule} from "../../orders/orders.module";
import {OrdersListComponent} from "../../orders/components/orders-list/orders-list.component";
import {OrderComponent} from "../../orders/components/order/order.component";

const routes: Routes = [
  {
    path: 'dashboard', component: SiteLayoutComponent, canActivate: [AuthGuard], data: {title: 'Обзор'}, children: [
      {
        path: '',
        component: DashboardPageComponent
      },
      {
        path: 'contacts',
        component: ContactPageComponent,
        canActivate: [NotManagerGuard],
        data: {
          title: 'Контакты'
        },
        children: [
          {
            path: '',
            component: ContactsListComponent
          },
          {
            path: 'new',
            component: CreateContactComponent
          },
          {
            path: ':id',
            component: ContactComponent
          }
        ]
      },
      {
        path: 'customers',
        component: CustomerPageComponent,
        data: {
          title: 'Клиенты'
        },
        children: [
          {
            path: '',
            component: CustomersListComponent
          },
          {
            path: 'new',
            component: CustomerCreateComponent,
            data: {
              title: 'Создание клиента'
            }
          },
          {
            path: 'edit/:id',
            component: CustomerEditComponent,
            data: {
              title: 'Редактирование клиента'
            }
          },
          {
            path: ':id',
            component: CustomerComponent,
            data: {
              title: 'Карточка клиента'
            }
          }
        ]
      },
      {
        path: 'orders',
        component: OrderPageComponent,
        data: {
          title: 'Заказы'
        },
        children: [
          {
            path: '',
            component: OrdersListComponent
          },
          {
            path: 'new',
            component: OrderCreateComponent,
            data: {
              title: 'Создание заказа'
            }
          },
          /*{
            path: 'edit/:id',
            component: OrderEditComponent,
            data: {
              title: 'Редактирование клиента'
            }
          },*/
          {
            path: ':id',
            component: OrderComponent,
            data: {
              title: 'Карточка заказа'
            }
          }
        ]
      }
    ]
  }
];

@NgModule({
  declarations: [SiteLayoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DashboardModule,
    CustomersModule,
    OrdersModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule
  ]
})
export class SiteLayoutModule { }

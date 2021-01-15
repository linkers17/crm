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

const routes: Routes = [
  {
    path: 'dashboard', component: SiteLayoutComponent, canActivate: [AuthGuard], data: {title: 'Обзор'}, children: [
      {
        path: 'contacts',
        component: ContactsListComponent,
        canActivate: [NotManagerGuard],
        data: {
          title: 'Контакты'
        }
      },
      {
        path: 'contact/:id',
        component: ContactComponent,
        canActivate: [NotManagerGuard]
      }
    ]
  }
];

@NgModule({
  declarations: [SiteLayoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule
  ]
})
export class SiteLayoutModule { }

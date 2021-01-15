import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ContactsService} from "./services/contacts.service";
import {reducer} from "./store/reducers";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {GetContactsEffect} from "./store/effects/getContacts.effect";
import { ContactsListComponent } from './components/contacts-list/contacts-list.component';
import { ContactComponent } from './components/contact/contact.component';
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {RouterModule} from "@angular/router";
import {RemoveContactEffect} from "./store/effects/removeContact.effect";
import {SuccessMessagesModule} from "../success-messages/success-messages.module";
import {BackendErrorMessagesModule} from "../backend-error-messages/backend-error-messages.module";
import {MatCardModule} from "@angular/material/card";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";

@NgModule({
  declarations: [ContactsListComponent, ContactComponent],
  imports: [
    CommonModule,
    StoreModule.forFeature('contacts', reducer),
    EffectsModule.forFeature([
      GetContactsEffect,
      RemoveContactEffect
    ]),
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    SuccessMessagesModule,
    BackendErrorMessagesModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    ContactsService
  ]
})
export class ContactsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ContactsService} from "./services/contacts.service";
import {reducer} from "./store/reducers";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {GetContactsEffect} from "./store/effects/getContacts.effect";
import { ContactsListComponent } from './components/contacts-list/contacts-list.component';
import { ContactComponent } from './components/contact/contact.component';

@NgModule({
  declarations: [ContactsListComponent, ContactComponent],
  imports: [
    CommonModule,
    StoreModule.forFeature('contacts', reducer),
    EffectsModule.forFeature([
      GetContactsEffect
    ])
  ],
  providers: [
    ContactsService
  ]
})
export class ContactsModule { }

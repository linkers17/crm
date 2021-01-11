import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ContactsService} from "./services/contacts.service";
import {reducer} from "./store/reducers";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {GetContactsEffect} from "./store/effects/getContacts.effect";



@NgModule({
  declarations: [],
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

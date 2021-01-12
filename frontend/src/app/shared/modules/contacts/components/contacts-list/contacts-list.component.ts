import { Component, OnInit } from '@angular/core';
import {select, Store} from "@ngrx/store";
import {getContactsAction} from "../../store/actions/getContacts.action";
import {Observable} from "rxjs";
import {ContactsInterface} from "../../types/contacts.interface";
import {contactsSelector, successContactsSelector} from "../../store/selectors";
import {environment} from "../../../../../../environments/environment";
import {removeContactAction} from "../../store/actions/removeContact.action";
import {filter, map} from "rxjs/operators";

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.scss']
})
export class ContactsListComponent implements OnInit {

  apiUpload = `${environment.API_UPLOADS}/`;

  //table
  columns = ['name', 'img', 'view', 'remove'];

  // selectors
  contacts$: Observable<ContactsInterface[] | null>;
  successMessages$: Observable<string | null>;

  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {
    this.store.dispatch(getContactsAction());
    this.initializeValues();
  }

  initializeValues(): void {
    this.contacts$ = this.store.pipe(select(contactsSelector));
    this.successMessages$ = this.store.pipe(
      select(successContactsSelector),
      filter(message => message !== null),
      map(message => message.message)
    );
  }

  onRemove(id: string): void {
    this.store.dispatch(removeContactAction({id}));
  }
}

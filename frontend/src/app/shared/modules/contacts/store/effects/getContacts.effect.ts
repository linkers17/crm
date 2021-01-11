import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {ContactsService} from "../../services/contacts.service";
import {getContactsAction, getContactsFailureAction, getContactsSuccessAction} from "../actions/getContacts.action";
import {catchError, map, switchMap} from "rxjs/operators";
import {ContactsInterface} from "../../types/contacts.interface";
import {of} from "rxjs";

@Injectable()
export class GetContactsEffect {

  getContacts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getContactsAction),
      switchMap(() => {
        return this.contactsService.getContacts()
          .pipe(
            map((contacts: ContactsInterface[]) => {
              return getContactsSuccessAction({contacts})
            }),
            catchError(() => {
              return of(getContactsFailureAction())
            })
          )
      })
    )
  );

  constructor(
    private actions$: Actions,
    private contactsService: ContactsService
  ) {
  }

}

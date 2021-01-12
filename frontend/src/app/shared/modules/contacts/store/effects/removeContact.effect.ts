import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {ContactsService} from "../../services/contacts.service";
import {catchError, map, switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {
  removeContactAction,
  removeContactFailureAction,
  removeContactSuccessAction
} from "../actions/removeContact.action";
import {BackendMessagesInterface} from "../../../../types/backendMessages.interface";

@Injectable()
export class RemoveContactEffect {

  removeContacts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeContactAction),
      switchMap(contact => {
        return this.contactsService.removeContact(contact.id)
          .pipe(
            map((message: BackendMessagesInterface)=> {
              return removeContactSuccessAction({message, id: contact.id})
            }),
            catchError(() => {
              return of(removeContactFailureAction())
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

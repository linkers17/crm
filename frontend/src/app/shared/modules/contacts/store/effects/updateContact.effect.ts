import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {
  updateContactAction,
  updateContactFailureAction,
  updateContactSuccessAction
} from "../actions/updateContact.action";
import {ContactsService} from "../../services/contacts.service";
import {ContactsInterface} from "../../types/contacts.interface";

@Injectable()
export class UpdateContactEffect {
  updateContact$ = createEffect(() => this.actions$.pipe(
    ofType(updateContactAction),
    switchMap(({id, request}) => {
      return this.contactsService.updateContact(id, request)
        .pipe(
          map((response: ContactsInterface) => {
            return updateContactSuccessAction({response})
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(updateContactFailureAction({errors: errorResponse.error.errors}))
          })
        )
    })
  ));

  constructor(
    private actions$: Actions,
    private contactsService: ContactsService
  ) {
  }
}

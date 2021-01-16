import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {ContactsService} from "../../services/contacts.service";
import {catchError, map, switchMap, tap} from "rxjs/operators";
import {ContactsInterface} from "../../types/contacts.interface";
import {of} from "rxjs";
import {
  getContactByIdAction,
  getContactByIdFailureAction,
  getContactByIdSuccessAction
} from "../actions/getContact.action";
import {HttpErrorResponse} from "@angular/common/http";
import {Location} from "@angular/common";

@Injectable()
export class GetContactByIdEffect {

  getContactById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getContactByIdAction),
      switchMap((contact) => {
        return this.contactsService.getContact(contact.id)
          .pipe(
            map((contact: ContactsInterface) => {
              return getContactByIdSuccessAction({contact})
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              return of(getContactByIdFailureAction({errors: errorResponse.error.errors}))
            })
          )
      })
    )
  );

  redirectAfterFailure$ = createEffect(
    () => this.actions$.pipe(
      ofType(getContactByIdFailureAction),
      tap(() => {
        this.location.back();
      })
    ),
    {dispatch: false}
  );

  constructor(
    private actions$: Actions,
    private contactsService: ContactsService,
    private location: Location
  ) {
  }

}

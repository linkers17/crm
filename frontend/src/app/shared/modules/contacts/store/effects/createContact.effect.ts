import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, delay, map, switchMap, tap} from "rxjs/operators";
import {of} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {ContactsService} from "../../services/contacts.service";
import {
  createContactAction,
  createContactFailureAction,
  createContactSuccessAction
} from "../actions/createContact.action";
import {ContactsInterface} from "../../types/contacts.interface";

@Injectable()
export class CreateContactEffect {
  createContact$ = createEffect(() => this.actions$.pipe(
    ofType(createContactAction),
    switchMap(({request}) => {
      return this.contactsService.createContact(request)
        .pipe(
          map((response: ContactsInterface) => {
            return createContactSuccessAction({response})
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(createContactFailureAction({errors: errorResponse.error.errors}))
          })
        )
    })
  ));

  redirectAfterSubmit$ = createEffect(
    () => this.actions$.pipe(
      ofType(createContactSuccessAction),
      delay(10),
      tap(() => {
        this.router.navigate(['/', 'dashboard', 'contacts']);
      })
    ),
    {
      dispatch: false
    }
  )

  constructor(
    private actions$: Actions,
    private contactsService: ContactsService,
    private router: Router
  ) {
  }
}

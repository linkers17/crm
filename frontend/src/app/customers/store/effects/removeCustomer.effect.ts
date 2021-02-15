import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, delay, filter, map, switchMap, tap} from "rxjs/operators";
import {of} from "rxjs";
import {CustomersService} from "../../services/customers.service";
import {
  removeCustomerAction,
  removeCustomerFailureAction,
  removeCustomerSuccessAction
} from "../actions/removeCustomer.action";
import {BackendMessagesInterface} from "../../../shared/types/backendMessages.interface";
import {HttpErrorResponse} from "@angular/common/http";
import {Location} from "@angular/common";

@Injectable()
export class RemoveCustomerEffect {

  removeCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeCustomerAction),
      switchMap(customer => {
        return this.customersService.removeCustomer(customer.id)
          .pipe(
            map((message: BackendMessagesInterface)=> {
              return removeCustomerSuccessAction({message, id: customer.id, redirect: customer.redirect})
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              return of(removeCustomerFailureAction({errors: errorResponse.error.errors}))
            })
          )
      })
    )
  );

  redirectAfterSuccess$ = createEffect(
    () => this.actions$.pipe(
      ofType(removeCustomerSuccessAction),
      filter(response => response.redirect),
      delay(10),
      tap(() => {
        console.log(131654);
        this.location.back();
      })
    ),
    {dispatch: false}
  );

  constructor(
    private actions$: Actions,
    private location: Location,
    private customersService: CustomersService
  ) {
  }

}

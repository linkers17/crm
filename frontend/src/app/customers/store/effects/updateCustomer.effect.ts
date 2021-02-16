import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, delay, map, switchMap, tap} from "rxjs/operators";
import {of} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {
  updateCustomerAction,
  updateCustomerFailureAction,
  updateCustomerSuccessAction
} from "../actions/updateCustomer.action";
import {CustomersService} from "../../services/customers.service";
import {UpdateCustomerResponseInterface} from "../../types/updateCustomerResponse.interface";
import {Location} from "@angular/common";

@Injectable()
export class UpdateCustomerEffect {
  updateCustomer$ = createEffect(() => this.actions$.pipe(
    ofType(updateCustomerAction),
    switchMap(({id, request}) => {
      return this.customersService.updateCustomer(id, request)
        .pipe(
          map((response: UpdateCustomerResponseInterface) => {
            return updateCustomerSuccessAction({response})
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(updateCustomerFailureAction({errors: errorResponse.error.errors}))
          })
        )
    })
  ));

  redirectAfterSuccess$ = createEffect(
    () => this.actions$.pipe(
      ofType(updateCustomerSuccessAction),
      delay(10),
      tap(() => {
        this.location.back();
      })
    ),
    {dispatch: false}
  );

  constructor(
    private location: Location,
    private actions$: Actions,
    private customersService: CustomersService
  ) {
  }
}

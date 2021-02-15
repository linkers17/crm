import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, switchMap, tap} from "rxjs/operators";
import {of} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {Location} from "@angular/common";
import {CustomersService} from "../../services/customers.service";
import {
  getCustomerByIdAction,
  getCustomerByIdFailureAction,
  getCustomerByIdSuccessAction
} from "../actions/getCustomer.action";
import {GetCustomerResponseInterface} from "../../types/getCustomerResponse.interface";

@Injectable()
export class GetCustomerByIdEffect {

  getCustomerById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getCustomerByIdAction),
      switchMap((customer) => {
        return this.customersService.getCustomer(customer.id)
          .pipe(
            map((customer: GetCustomerResponseInterface) => {
              return getCustomerByIdSuccessAction(customer)
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              return of(getCustomerByIdFailureAction({errors: errorResponse.error.errors}))
            })
          )
      })
    )
  );

  redirectAfterFailure$ = createEffect(
    () => this.actions$.pipe(
      ofType(getCustomerByIdFailureAction),
      tap(() => {
        this.location.back();
      })
    ),
    {dispatch: false}
  );

  constructor(
    private actions$: Actions,
    private customersService: CustomersService,
    private location: Location
  ) {
  }

}

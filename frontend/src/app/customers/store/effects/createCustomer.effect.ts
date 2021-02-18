import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, delay, map, switchMap, tap} from "rxjs/operators";
import {of} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {CustomersService} from "../../services/customers.service";
import {
  createCustomerAction,
  createCustomerFailureAction,
  createCustomerSuccessAction
} from "../actions/createCustomer.action";
import {UpdateCustomerResponseInterface} from "../../types/updateCustomerResponse.interface";

@Injectable()
export class CreateCustomerEffect {
  createCustomer$ = createEffect(() => this.actions$.pipe(
    ofType(createCustomerAction),
    switchMap(({request}) => {
      return this.customersService.createCustomer(request)
        .pipe(
          map((response: UpdateCustomerResponseInterface) => {
            return createCustomerSuccessAction({response})
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(createCustomerFailureAction({errors: errorResponse.error.errors}))
          })
        )
    })
  ));

  redirectAfterSubmit$ = createEffect(
    () => this.actions$.pipe(
      ofType(createCustomerSuccessAction),
      delay(10),
      tap((customer) => {
        this.router.navigate(['/', 'dashboard', 'customers', customer.response._id]);
      })
    ),
    {
      dispatch: false
    }
  )

  constructor(
    private actions$: Actions,
    private customersService: CustomersService,
    private router: Router
  ) {
  }
}

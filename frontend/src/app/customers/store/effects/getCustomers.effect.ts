import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {CustomersService} from "../../services/customers.service";
import {getCustomersAction, getCustomersFailureAction, getCustomersSuccessAction} from "../actions/getCustomers.action";
import {CustomersResponseInterface} from "../../types/customersResponse.interface";

@Injectable()
export class GetCustomersEffect {

  getCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getCustomersAction),
      switchMap(({url}) => {
        return this.customersService.getCustomers(url)
          .pipe(
            map((response: CustomersResponseInterface) => {
              return getCustomersSuccessAction(response)
            }),
            catchError(() => {
              return of(getCustomersFailureAction())
            })
          )
      })
    )
  );

  constructor(
    private actions$: Actions,
    private customersService: CustomersService
  ) {
  }

}

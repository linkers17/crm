import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {getOrdersAction, getOrdersFailureAction, getOrdersSuccessAction} from "../actions/getOrders.action";
import {OrdersResponseInterface} from "../../types/ordersResponse.interface";
import {OrdersService} from "../../services/orders.service";

@Injectable()
export class GetOrdersEffect {

  getOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getOrdersAction),
      switchMap(({url}) => {
        return this.ordersService.getOrders(url)
          .pipe(
            map((response: OrdersResponseInterface) => {
              return getOrdersSuccessAction(response)
            }),
            catchError(() => {
              return of(getOrdersFailureAction())
            })
          )
      })
    )
  );

  constructor(
    private actions$: Actions,
    private ordersService: OrdersService
  ) {
  }

}

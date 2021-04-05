import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, delay, map, switchMap, tap} from "rxjs/operators";
import {of} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {Location} from "@angular/common";
import {OrdersService} from "../../services/orders.service";
import {getOrderByIdAction, getOrderByIdFailureAction, getOrderByIdSuccessAction} from "../actions/getOrder.action";
import {GetOrderResponseInterface} from "../../types/getOrderResponse.interface";

@Injectable()
export class GetOrderByIdEffect {

  getOrderById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getOrderByIdAction),
      switchMap((order) => {
        return this.ordersService.getOrder(order.id)
          .pipe(
            map((order: GetOrderResponseInterface) => {
              return getOrderByIdSuccessAction({order})
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              return of(getOrderByIdFailureAction({errors: errorResponse.error.errors}))
            })
          )
      })
    )
  );

  redirectAfterFailure$ = createEffect(
    () => this.actions$.pipe(
      ofType(getOrderByIdFailureAction),
      delay(10),
      tap(() => {
        this.location.back();
      })
    ),
    {dispatch: false}
  );

  constructor(
    private actions$: Actions,
    private ordersService: OrdersService,
    private location: Location
  ) {
  }

}

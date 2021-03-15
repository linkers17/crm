import {createAction, props} from "@ngrx/store";
import {ActionTypes} from "../actionTypes";
import {OrdersInterface} from "../../types/orders.interface";

export const getOrdersAction = createAction(
  ActionTypes.GET_ORDERS,
  props<{url: string}>()
);

export const getOrdersSuccessAction = createAction(
  ActionTypes.GET_ORDERS_SUCCESS,
  props<{orders: OrdersInterface[], ordersCount: number}>()
);

export const getOrdersFailureAction = createAction(
  ActionTypes.GET_ORDERS_FAILURE
);

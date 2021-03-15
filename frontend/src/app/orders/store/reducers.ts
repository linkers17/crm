import {OrdersStateInterface} from "../types/ordersState.interface";
import {Action, createReducer, on} from "@ngrx/store";
import {getOrdersAction, getOrdersFailureAction, getOrdersSuccessAction} from "./actions/getOrders.action";

const initialState: OrdersStateInterface = {
  data: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  currentOrder: null,
  success: null,
  count: null
}

const orderReducer = createReducer(
  initialState,
  on(
    getOrdersAction,
    (state): OrdersStateInterface => ({
      ...state,
      isLoading: true
    })
  ),
  on(
    getOrdersSuccessAction,
    (state, action): OrdersStateInterface => ({
      ...state,
      isLoading: false,
      data: action.orders,
      count: action.ordersCount
    })
  ),
  on(
    getOrdersFailureAction,
    (state): OrdersStateInterface => ({
      ...state,
      isLoading: false
    })
  ),
);

export function reducer(state: OrdersStateInterface, action: Action) {
  return orderReducer(state, action)
}

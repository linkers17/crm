import {OrdersStateInterface} from "../types/ordersState.interface";
import {Action, createReducer, on} from "@ngrx/store";
import {getOrdersAction, getOrdersFailureAction, getOrdersSuccessAction} from "./actions/getOrders.action";
import {routerNavigationAction} from "@ngrx/router-store";
import {CustomersStateInterface} from "../../customers/types/customersState.interface";
import {
  getCustomerByIdAction,
  getCustomerByIdFailureAction,
  getCustomerByIdSuccessAction
} from "../../customers/store/actions/getCustomer.action";
import {getOrderByIdAction, getOrderByIdFailureAction, getOrderByIdSuccessAction} from "./actions/getOrder.action";

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
  on(
    getOrderByIdAction,
    (state): OrdersStateInterface => ({
      ...state,
      isLoading: true,
      error: null,
      success: null
    })
  ),
  on(
    getOrderByIdSuccessAction,
    (state, action): OrdersStateInterface => ({
      ...state,
      isLoading: false,
      currentOrder: action.order
    })
  ),
  on(
    getOrderByIdFailureAction,
    (state, action): OrdersStateInterface => ({
      ...state,
      isLoading: false,
      error: action.errors
    })
  ),
  on(
    routerNavigationAction,
    (state): OrdersStateInterface => ({
      ...state,
      currentOrder: null,
      data: null,
      error: null,
      success: null,
      count: null
    })
  )
);

export function reducer(state: OrdersStateInterface, action: Action) {
  return orderReducer(state, action)
}

import {OrdersStateInterface} from "../types/ordersState.interface";
import {Action, createReducer} from "@ngrx/store";

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
  initialState
);

export function reducer(state: OrdersStateInterface, action: Action) {
  return orderReducer(state, action)
}

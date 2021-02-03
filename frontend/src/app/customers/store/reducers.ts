import {CustomersStateInterface} from "../types/customersState.interface";
import {Action, createReducer, on} from "@ngrx/store";
import {getCustomersAction, getCustomersFailureAction, getCustomersSuccessAction} from "./actions/getCustomers.action";

const initialState: CustomersStateInterface = {
  data: null,
  isLoading: false,
  error: null,
  currentCustomer: null,
  success: null,
  count: null
}

const customerReducer = createReducer(
  initialState,
  on(
    getCustomersAction,
    (state): CustomersStateInterface => ({
      ...state,
      isLoading: true
    })
  ),
  on(
    getCustomersSuccessAction,
    (state, action): CustomersStateInterface => ({
      ...state,
      isLoading: false,
      data: action.customers,
      count: action.customersCount
    })
  ),
  on(
    getCustomersFailureAction,
    (state): CustomersStateInterface => ({
      ...state,
      isLoading: false
    })
  )
);

export function reducer(state: CustomersStateInterface, action: Action) {
  return customerReducer(state, action)
}

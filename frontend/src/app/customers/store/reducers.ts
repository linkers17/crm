import {CustomersStateInterface} from "../types/customersState.interface";
import {Action, createReducer, on} from "@ngrx/store";
import {getCustomersAction, getCustomersFailureAction, getCustomersSuccessAction} from "./actions/getCustomers.action";
import {
  getCustomerByIdAction,
  getCustomerByIdFailureAction,
  getCustomerByIdSuccessAction
} from "./actions/getCustomer.action";
import {routerNavigationAction} from "@ngrx/router-store";

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
  ),
  on(
    getCustomerByIdAction,
    (state): CustomersStateInterface => ({
      ...state,
      isLoading: true,
      error: null,
      success: null
    })
  ),
  on(
    getCustomerByIdSuccessAction,
    (state, action): CustomersStateInterface => ({
      ...state,
      isLoading: false,
      currentCustomer: action.customer
    })
  ),
  on(
    getCustomerByIdFailureAction,
    (state, action): CustomersStateInterface => ({
      ...state,
      isLoading: false,
      error: action.errors
    })
  ),
  on(
    routerNavigationAction,
    (state): CustomersStateInterface => ({
      ...state,
      currentCustomer: null,
      error: null,
      success: null
    })
  )
);

export function reducer(state: CustomersStateInterface, action: Action) {
  return customerReducer(state, action)
}

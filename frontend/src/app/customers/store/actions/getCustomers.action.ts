import {createAction, props} from "@ngrx/store";
import {ActionTypes} from "../actionTypes";
import {CustomersInterface} from "../../types/customers.interface";

export const getCustomersAction = createAction(
  ActionTypes.GET_CUSTOMERS,
  props<{url: string}>()
);

export const getCustomersSuccessAction = createAction(
  ActionTypes.GET_CUSTOMERS_SUCCESS,
  props<{customers: CustomersInterface[], customersCount: number}>()
);

export const getCustomersFailureAction = createAction(
  ActionTypes.GET_CUSTOMERS_FAILURE
);

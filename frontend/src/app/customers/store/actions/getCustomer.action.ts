import {createAction, props} from "@ngrx/store";
import {ActionTypes} from "../actionTypes";
import {GetCustomerInterface} from "../../types/getCustomer.interface";
import {BackendErrorsInterface} from "../../../shared/types/backendErrors.interface";

export const getCustomerByIdAction = createAction(
  ActionTypes.GET_CUSTOMER_BY_ID,
  props<{id: string}>()
);

export const getCustomerByIdSuccessAction = createAction(
  ActionTypes.GET_CUSTOMER_BY_ID_SUCCESS,
  props<{customer: GetCustomerInterface[]}>()
);

export const getCustomerByIdFailureAction = createAction(
  ActionTypes.GET_CUSTOMER_BY_ID_FAILURE,
  props<{errors: BackendErrorsInterface}>()
);

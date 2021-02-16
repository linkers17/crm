import {createAction, props} from "@ngrx/store";
import {ActionTypes} from "../actionTypes";
import {UpdateCustomerRequestInterface} from "../../types/updateCustomerRequest.interface";
import {BackendErrorsInterface} from "../../../shared/types/backendErrors.interface";
import {UpdateCustomerResponseInterface} from "../../types/updateCustomerResponse.interface";

export const updateCustomerAction = createAction(
  ActionTypes.UPDATE_CUSTOMER,
  props<{id: string, request: UpdateCustomerRequestInterface}>()
);

export const updateCustomerSuccessAction = createAction(
  ActionTypes.UPDATE_CUSTOMER_SUCCESS,
  props<{response: UpdateCustomerResponseInterface}>()
);

export const updateCustomerFailureAction = createAction(
  ActionTypes.UPDATE_CUSTOMER_FAILURE,
  props<{errors: BackendErrorsInterface}>()
);

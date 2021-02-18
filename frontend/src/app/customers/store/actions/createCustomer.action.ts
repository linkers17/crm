import {createAction, props} from "@ngrx/store";
import {ActionTypes} from "../actionTypes";
import {UpdateCustomerRequestInterface} from "../../types/updateCustomerRequest.interface";
import {UpdateCustomerResponseInterface} from "../../types/updateCustomerResponse.interface";
import {BackendErrorsInterface} from "../../../shared/types/backendErrors.interface";

export const createCustomerAction = createAction(
  ActionTypes.CREATE_CUSTOMER,
  props<{request: UpdateCustomerRequestInterface}>()
);

export const createCustomerSuccessAction = createAction(
  ActionTypes.CREATE_CUSTOMER_SUCCESS,
  props<{response: UpdateCustomerResponseInterface}>()
);

export const createCustomerFailureAction = createAction(
  ActionTypes.CREATE_CUSTOMER_FAILURE,
  props<{errors: BackendErrorsInterface}>()
);

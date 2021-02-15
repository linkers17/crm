import {createAction, props} from "@ngrx/store";
import {ActionTypes} from "../actionTypes";
import {BackendMessagesInterface} from "../../../shared/types/backendMessages.interface";
import {BackendErrorsInterface} from "../../../shared/types/backendErrors.interface";

export const removeCustomerAction = createAction(
  ActionTypes.REMOVE_CUSTOMER,
  props<{ id: string, redirect: boolean }>()
);

export const removeCustomerSuccessAction = createAction(
  ActionTypes.REMOVE_CUSTOMER_SUCCESS,
  props<{message: BackendMessagesInterface, id: string, redirect: boolean}>()
);

export const removeCustomerFailureAction = createAction(
  ActionTypes.REMOVE_CUSTOMER_FAILURE,
  props<{errors: BackendErrorsInterface}>()
);

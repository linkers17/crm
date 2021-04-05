import {createAction, props} from "@ngrx/store";
import {BackendErrorsInterface} from "../../../shared/types/backendErrors.interface";
import {ActionTypes} from "../actionTypes";
import {GetOrderResponseInterface} from "../../types/getOrderResponse.interface";

export const getOrderByIdAction = createAction(
  ActionTypes.GET_ORDER_BY_ID,
  props<{id: string}>()
);

export const getOrderByIdSuccessAction = createAction(
  ActionTypes.GET_ORDER_BY_ID_SUCCESS,
  props<{order: GetOrderResponseInterface}>()
);

export const getOrderByIdFailureAction = createAction(
  ActionTypes.GET_ORDER_BY_ID_FAILURE,
  props<{errors: BackendErrorsInterface}>()
);

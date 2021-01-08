import {createAction, props} from "@ngrx/store";

import {ActionTypes} from "../actionTypes";
import {RegisterRequestInterface} from "../../types/registerRequest.interface";
import {RegisterResponseInterface} from "../../types/registerResponse.interface";
import {BackendErrorsInterface} from "../../../shared/types/backendErrors.interface";

export const registerAction = createAction(
  ActionTypes.REGISTER,
  props<{request: RegisterRequestInterface}>()
);

export const registerSuccessAction = createAction(
  ActionTypes.REGISTER_SUCCESS,
  props<{response: RegisterResponseInterface}>()
);

export const registerFailureAction = createAction(
  ActionTypes.REGISTER_FAILURE,
  props<{errors: BackendErrorsInterface}>()
);

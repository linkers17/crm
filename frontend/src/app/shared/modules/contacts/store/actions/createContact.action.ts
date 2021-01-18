import {createAction, props} from "@ngrx/store";
import {ActionTypes} from "../actionTypes";
import {ContactRequestInterface} from "../../types/contactRequest.interface";
import {ContactsInterface} from "../../types/contacts.interface";
import {BackendErrorsInterface} from "../../../../types/backendErrors.interface";

export const createContactAction = createAction(
  ActionTypes.CREATE_CONTACT,
  props<{request: ContactRequestInterface}>()
);

export const createContactSuccessAction = createAction(
  ActionTypes.CREATE_CONTACT_SUCCESS,
  props<{response: ContactsInterface}>()
);

export const createContactFailureAction = createAction(
  ActionTypes.CREATE_CONTACT_FAILURE,
  props<{errors: BackendErrorsInterface}>()
);

import {createAction, props} from "@ngrx/store";
import {ActionTypes} from "../actionTypes";
import {ContactUpdateRequestInterface} from "../../types/contactUpdateRequest.interface";
import {ContactsInterface} from "../../types/contacts.interface";
import {BackendErrorsInterface} from "../../../../types/backendErrors.interface";

export const updateContactAction = createAction(
  ActionTypes.UPDATE_CONTACT,
  props<{id: string, request: ContactUpdateRequestInterface}>()
);

export const updateContactSuccessAction = createAction(
  ActionTypes.UPDATE_CONTACT_SUCCESS,
  props<{response: ContactsInterface}>()
);

export const updateContactFailureAction = createAction(
  ActionTypes.UPDATE_CONTACT_FAILURE,
  props<{errors: BackendErrorsInterface}>()
);

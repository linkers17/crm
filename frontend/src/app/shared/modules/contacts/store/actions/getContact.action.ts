import {createAction, props} from "@ngrx/store";
import {ActionTypes} from "../actionTypes";
import {ContactsInterface} from "../../types/contacts.interface";
import {BackendErrorsInterface} from "../../../../types/backendErrors.interface";

export const getContactByIdAction = createAction(
  ActionTypes.GET_CONTACT_BY_ID,
  props<{id: string}>()
);

export const getContactByIdSuccessAction = createAction(
  ActionTypes.GET_CONTACT_BY_ID_SUCCESS,
  props<{contact: ContactsInterface}>()
);

export const getContactByIdFailureAction = createAction(
  ActionTypes.GET_CONTACT_BY_ID_FAILURE,
  props<{errors: BackendErrorsInterface}>()
);

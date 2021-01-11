import {createAction, props} from "@ngrx/store";
import {ActionTypes} from "../actionTypes";
import {ContactsInterface} from "../../types/contacts.interface";

export const getContactsAction = createAction(
  ActionTypes.GET_CONTACTS
);

export const getContactsSuccessAction = createAction(
  ActionTypes.GET_CONTACTS_SUCCESS,
  props<{contacts: ContactsInterface[]}>()
);

export const getContactsFailureAction = createAction(
  ActionTypes.GET_CONTACTS_FAILURE
);

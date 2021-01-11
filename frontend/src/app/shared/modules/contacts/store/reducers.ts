import {ContactsStateInterface} from "../types/contactsState.interface";
import {Action, createReducer, on} from "@ngrx/store";
import {getContactsAction, getContactsFailureAction, getContactsSuccessAction} from "./actions/getContacts.action";

const initialState: ContactsStateInterface = {
  data: null,
  error: null,
  isLoading: false
};

const contactsReducer = createReducer(
  initialState,
  on(
    getContactsAction,
    (state): ContactsStateInterface => ({
      ...state,
      isLoading: true
    })
  ),
  on(
    getContactsSuccessAction,
    (state, action): ContactsStateInterface => ({
      ...state,
      isLoading: false,
      data: action.contacts
    })
  ),
  on(
    getContactsFailureAction,
    (state): ContactsStateInterface => ({
      ...state,
      isLoading: false
    })
  ),
);

export function reducer(state: ContactsStateInterface, action: Action) {
  return contactsReducer(state, action);
}

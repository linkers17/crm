import {ContactsStateInterface} from "../types/contactsState.interface";
import {Action, createReducer, on} from "@ngrx/store";
import {getContactsAction, getContactsFailureAction, getContactsSuccessAction} from "./actions/getContacts.action";
import {
  removeContactAction,
  removeContactFailureAction,
  removeContactSuccessAction
} from "./actions/removeContact.action";

const initialState: ContactsStateInterface = {
  data: null,
  error: null,
  isLoading: false,
  success: null
};

const contactsReducer = createReducer(
  initialState,
  on(
    getContactsAction,
    (state): ContactsStateInterface => ({
      ...state,
      isLoading: true,
      error: null,
      success: null
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
  on(
    removeContactAction,
    (state): ContactsStateInterface => ({
      ...state,
      isLoading: true,
      error: null,
      success: null
    })
  ),
  on(
    removeContactSuccessAction,
    (state, action): ContactsStateInterface => ({
      ...state,
      isLoading: false,
      success: action.message,
      data: state.data.filter(contact => contact._id !== action.id)
    })
  ),
  on(
    removeContactFailureAction,
    (state): ContactsStateInterface => ({
      ...state,
      isLoading: false,
      error: 'Что-то пошло не так. Повторите попытку позже'
    })
  ),
);

export function reducer(state: ContactsStateInterface, action: Action) {
  return contactsReducer(state, action);
}

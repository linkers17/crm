import {ContactsStateInterface} from "../types/contactsState.interface";
import {Action, createReducer, on} from "@ngrx/store";
import {getContactsAction, getContactsFailureAction, getContactsSuccessAction} from "./actions/getContacts.action";
import {
  removeContactAction,
  removeContactFailureAction,
  removeContactSuccessAction
} from "./actions/removeContact.action";
import {
  getContactByIdAction,
  getContactByIdFailureAction,
  getContactByIdSuccessAction
} from "./actions/getContact.action";
import {routerNavigationAction} from "@ngrx/router-store";

const initialState: ContactsStateInterface = {
  data: null,
  error: null,
  isLoading: false,
  success: null,
  currentContact: null
};

const reducers = createReducer(
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
  on(
    getContactByIdAction,
    (state): ContactsStateInterface => ({
      ...state,
      isLoading: true,
      error: null,
      success: null
    })
  ),
  on(
    getContactByIdSuccessAction,
    (state, action): ContactsStateInterface => ({
      ...state,
      isLoading: false,
      currentContact: action.contact
    })
  ),
  on(
    getContactByIdFailureAction,
    (state, action): ContactsStateInterface => ({
      ...state,
      isLoading: false,
      error: action.errors
    })
  ),
  on(
    routerNavigationAction,
    (state): ContactsStateInterface => ({
      ...state,
      currentContact: null
    })
  )
);

export function reducer(state: ContactsStateInterface, action: Action) {
  return reducers(state, action);
}

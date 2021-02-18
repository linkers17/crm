import {CustomersStateInterface} from "../types/customersState.interface";
import {Action, createReducer, on} from "@ngrx/store";
import {getCustomersAction, getCustomersFailureAction, getCustomersSuccessAction} from "./actions/getCustomers.action";
import {
  getCustomerByIdAction,
  getCustomerByIdFailureAction,
  getCustomerByIdSuccessAction
} from "./actions/getCustomer.action";
import {routerNavigationAction} from "@ngrx/router-store";
import {
  removeCustomerAction,
  removeCustomerFailureAction,
  removeCustomerSuccessAction
} from "./actions/removeCustomer.action";
import {
  updateCustomerAction,
  updateCustomerFailureAction,
  updateCustomerSuccessAction
} from "./actions/updateCustomer.action";
import {
  createContactAction, createContactFailureAction,
  createContactSuccessAction
} from "../../shared/modules/contacts/store/actions/createContact.action";
import {ContactsStateInterface} from "../../shared/modules/contacts/types/contactsState.interface";
import {
  createCustomerAction,
  createCustomerFailureAction,
  createCustomerSuccessAction
} from "./actions/createCustomer.action";

const initialState: CustomersStateInterface = {
  data: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  currentCustomer: null,
  success: null,
  count: null
}

const customerReducer = createReducer(
  initialState,
  on(
    getCustomersAction,
    (state): CustomersStateInterface => ({
      ...state,
      isLoading: true
    })
  ),
  on(
    getCustomersSuccessAction,
    (state, action): CustomersStateInterface => ({
      ...state,
      isLoading: false,
      data: action.customers,
      count: action.customersCount
    })
  ),
  on(
    getCustomersFailureAction,
    (state): CustomersStateInterface => ({
      ...state,
      isLoading: false
    })
  ),
  on(
    getCustomerByIdAction,
    (state): CustomersStateInterface => ({
      ...state,
      isLoading: true,
      error: null,
      success: null
    })
  ),
  on(
    getCustomerByIdSuccessAction,
    (state, action): CustomersStateInterface => ({
      ...state,
      isLoading: false,
      currentCustomer: action.customer
    })
  ),
  on(
    getCustomerByIdFailureAction,
    (state, action): CustomersStateInterface => ({
      ...state,
      isLoading: false,
      error: action.errors
    })
  ),
  on(
    removeCustomerAction,
    (state): CustomersStateInterface => ({
      ...state,
      isLoading: true,
      error: null,
      success: null
    })
  ),
  on(
    removeCustomerSuccessAction,
    (state, action): CustomersStateInterface => ({
      ...state,
      isLoading: false,
      success: action.message,
      data: state.data.filter(customer => customer._id !== action.id),
      count: state.count - 1
    })
  ),
  on(
    removeCustomerFailureAction,
    (state, action): CustomersStateInterface => ({
      ...state,
      isLoading: false,
      error: action.errors
    })
  ),
  on(
    updateCustomerAction,
    (state): CustomersStateInterface => ({
      ...state,
      isSubmitting: true,
      error: null,
      success: null
    })
  ),
  on(
    updateCustomerSuccessAction,
    (state): CustomersStateInterface => ({
      ...state,
      isSubmitting: false,
      success: {message: 'Изменения успешно сохранены.'}
    })
  ),
  on(
    updateCustomerFailureAction,
    (state, action): CustomersStateInterface => ({
      ...state,
      isSubmitting: false,
      error: action.errors
    })
  ),
  on(
    createCustomerAction,
    (state): CustomersStateInterface => ({
      ...state,
      isSubmitting: true,
      error: null,
      success: null
    })
  ),
  on(
    createCustomerSuccessAction,
    (state): CustomersStateInterface => ({
      ...state,
      isSubmitting: false,
      success: {message: 'Клиент успешно создан.'}
    })
  ),
  on(
    createCustomerFailureAction,
    (state, action): CustomersStateInterface => ({
      ...state,
      isSubmitting: false,
      error: action.errors
    })
  ),
  on(
    routerNavigationAction,
    (state): CustomersStateInterface => ({
      ...state,
      currentCustomer: null,
      error: null,
      success: null
    })
  )
);

export function reducer(state: CustomersStateInterface, action: Action) {
  return customerReducer(state, action)
}

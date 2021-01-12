import {AuthStateInterface} from "../types/authState.interface";
import {Action, createReducer, on} from "@ngrx/store";
import {registerAction, registerFailureAction, registerSuccessAction} from "./actions/register.action";
import {loginAction, loginFailureAction, loginSuccessAction} from "./actions/login.action";
import {
  getCurrentUserAction,
  getCurrentUserFailureAction,
  getCurrentUserSuccessAction
} from "./actions/getCurrentUser.action";
import {logoutAction} from "./actions/sync.action";

const initialState: AuthStateInterface = {
  isSubmitting: false,
  isLoading: false,
  currentUser: null,
  isLoggedIn: null,
  validationErrors: null,
  registerSuccess: null
}

const authReducer = createReducer(
  initialState,
  on(registerAction, (state): AuthStateInterface => ({
    ...state,
    isSubmitting: true,
    validationErrors: null,
    registerSuccess: null
  })),
  on(registerSuccessAction, (state): AuthStateInterface => ({
    ...state,
    isSubmitting: false,
    validationErrors: null,
    registerSuccess: 'Аккаунт успешно зарегистрирован. Можно войти в систему'
  })),
  on(registerFailureAction, (state, action): AuthStateInterface => ({
    ...state,
    isSubmitting: false,
    validationErrors: action.errors,
    registerSuccess: null
  })),
  on(loginAction, (state): AuthStateInterface => ({
    ...state,
    isSubmitting: true,
    validationErrors: null,
    registerSuccess: null
  })),
  on(loginSuccessAction, (state, action): AuthStateInterface => ({
    ...state,
    isSubmitting: false,
    currentUser: action.response,
    isLoggedIn: true
  })),
  on(loginFailureAction, (state, action): AuthStateInterface => ({
    ...state,
    isSubmitting: false,
    validationErrors: action.errors
  })),
  on(getCurrentUserAction, (state): AuthStateInterface => ({
    ...state,
    isLoading: true
  })),
  on(getCurrentUserSuccessAction, (state, action): AuthStateInterface => ({
    ...state,
    isLoading: false,
    isLoggedIn: true,
    currentUser: action.response
  })),
  on(getCurrentUserFailureAction, (state): AuthStateInterface => ({
    ...state,
    isLoading: false,
    isLoggedIn: false,
    currentUser: null
  })),
  on(logoutAction, (): AuthStateInterface => ({
    ...initialState,
    isLoggedIn: false
  })),
);

export function reducer(state: AuthStateInterface, action: Action) {
  return authReducer(state, action);
}

import {AuthStateInterface} from "../types/authState.interface";
import {Action, createReducer, on} from "@ngrx/store";
import {registerAction, registerFailureAction, registerSuccessAction} from "./actions/register.action";

const initialState: AuthStateInterface = {
  isSubmitting: false,
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
  }))
);

export function reducer(state: AuthStateInterface, action: Action) {
  return authReducer(state, action);
}

import {CurrentUserInterface} from "../../shared/types/currentUser.interface";
import {BackendErrorsInterface} from "../../shared/types/backendErrors.interface";
import {BackendMessagesInterface} from "../../shared/types/backendMessages.interface";

export interface AuthStateInterface {
  isSubmitting: boolean,
  isLoading: boolean,
  currentUser: CurrentUserInterface | null,
  isLoggedIn: boolean | null,
  validationErrors: BackendErrorsInterface | null,
  registerSuccess: BackendMessagesInterface | null
}

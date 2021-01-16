import {ContactsInterface} from "./contacts.interface";
import {BackendMessagesInterface} from "../../../types/backendMessages.interface";
import {BackendErrorsInterface} from "../../../types/backendErrors.interface";

export interface ContactsStateInterface {
  data: ContactsInterface[] | null,
  error: BackendErrorsInterface | string | null,
  isLoading: boolean,
  success: BackendMessagesInterface | null,
  currentContact: ContactsInterface | null
}

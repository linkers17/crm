import {ContactsInterface} from "./contacts.interface";
import {BackendMessagesInterface} from "../../../types/backendMessages.interface";

export interface ContactsStateInterface {
  data: ContactsInterface[] | null,
  error: string | null,
  isLoading: boolean,
  success: BackendMessagesInterface | null
}

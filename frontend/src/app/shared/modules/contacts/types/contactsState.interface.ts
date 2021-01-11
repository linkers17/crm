import {ContactsInterface} from "./contacts.interface";

export interface ContactsStateInterface {
  data: ContactsInterface[] | null,
  error: string | null,
  isLoading: boolean
}

import {ContactsInterface} from "./contacts.interface";

export interface ContactStateInterface {
  data: ContactsInterface | null,
  error: string | null,
  isLoading: boolean
}

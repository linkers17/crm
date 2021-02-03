import {CustomersInterface} from "./customers.interface";
import {BackendErrorsInterface} from "../../shared/types/backendErrors.interface";
import {BackendMessagesInterface} from "../../shared/types/backendMessages.interface";

export interface CustomersStateInterface {
  data: CustomersInterface[] | null,
  error: BackendErrorsInterface | null,
  isLoading: boolean,
  success: BackendMessagesInterface | null,
  currentCustomer: CustomersInterface | null,
  count: number | null
}

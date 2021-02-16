import {CustomersInterface} from "./customers.interface";
import {BackendErrorsInterface} from "../../shared/types/backendErrors.interface";
import {BackendMessagesInterface} from "../../shared/types/backendMessages.interface";
import {GetCustomerInterface} from "./getCustomer.interface";

export interface CustomersStateInterface {
  data: CustomersInterface[] | null,
  error: BackendErrorsInterface | null,
  isLoading: boolean,
  isSubmitting: boolean,
  success: BackendMessagesInterface | null,
  currentCustomer: GetCustomerInterface[] | null,
  count: number | null
}

import {BackendErrorsInterface} from "../../shared/types/backendErrors.interface";
import {BackendMessagesInterface} from "../../shared/types/backendMessages.interface";

export interface OrdersStateInterface {
  data: null,
  error: BackendErrorsInterface | null,
  isLoading: boolean,
  isSubmitting: boolean,
  success: BackendMessagesInterface | null,
  currentOrder: null,
  count: number | null
}

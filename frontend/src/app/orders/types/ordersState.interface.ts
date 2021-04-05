import {BackendErrorsInterface} from "../../shared/types/backendErrors.interface";
import {BackendMessagesInterface} from "../../shared/types/backendMessages.interface";
import {OrdersInterface} from "./orders.interface";
import {GetOrderResponseInterface} from "./getOrderResponse.interface";

export interface OrdersStateInterface {
  data: OrdersInterface[] | null,
  error: BackendErrorsInterface | null,
  isLoading: boolean,
  isSubmitting: boolean,
  success: BackendMessagesInterface | null,
  currentOrder: GetOrderResponseInterface | null,
  count: number | null
}

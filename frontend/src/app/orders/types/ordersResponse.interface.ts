import {OrdersInterface} from "./orders.interface";

export interface OrdersResponseInterface {
  orders: OrdersInterface[],
  ordersCount: number
}

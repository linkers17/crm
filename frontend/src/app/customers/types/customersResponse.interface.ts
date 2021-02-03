import {CustomersInterface} from "./customers.interface";

export interface CustomersResponseInterface {
  customers: CustomersInterface[],
  customersCount: number
}

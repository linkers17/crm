export enum ActionTypes {
  GET_CUSTOMERS = '[Customers] Get customers',
  GET_CUSTOMERS_SUCCESS = '[Customers] Get customers success',
  GET_CUSTOMERS_FAILURE = '[Customers] Get customers failure',

  GET_CUSTOMER_BY_ID = '[Customer] Get customer by id',
  GET_CUSTOMER_BY_ID_SUCCESS = '[Customer] Get customer by id success',
  GET_CUSTOMER_BY_ID_FAILURE = '[Customer] Get customer by id failure',

  UPDATE_CUSTOMER = '[Customer] Update customer',
  UPDATE_CUSTOMER_SUCCESS = '[Customer] Update customer success',
  UPDATE_CUSTOMER_FAILURE = '[Customer] Update customer failure',

  CREATE_CUSTOMER = '[Customer] Create customer',
  CREATE_CUSTOMER_SUCCESS = '[Customer] Create customer success',
  CREATE_CUSTOMER_FAILURE = '[Customer] Create customer failure',

  REMOVE_CUSTOMER = '[Customer] Remove customer',
  REMOVE_CUSTOMER_SUCCESS = '[Customer] Remove customer success',
  REMOVE_CUSTOMER_FAILURE = '[Customer] Remove customer failure',
}

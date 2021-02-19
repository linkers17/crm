export enum ActionTypes {
  GET_ORDERS = '[Orders] Get customers',
  GET_ORDERS_SUCCESS = '[Orders] Get orders success',
  GET_ORDERS_FAILURE = '[Orders] Get orders failure',

  GET_ORDER_BY_ID = '[Order] Get order by id',
  GET_ORDER_BY_ID_SUCCESS = '[Order] Get order by id success',
  GET_ORDER_BY_ID_FAILURE = '[Order] Get order by id failure',

  UPDATE_ORDER = '[Order] Update order',
  UPDATE_ORDER_SUCCESS = '[Order] Update order success',
  UPDATE_ORDER_FAILURE = '[Order] Update order failure',

  CREATE_ORDER = '[Order] Create order',
  CREATE_ORDER_SUCCESS = '[Order] Create order success',
  CREATE_ORDER_FAILURE = '[Order] Create order failure',

  REMOVE_ORDER = '[Order] Remove order',
  REMOVE_ORDER_SUCCESS = '[Order] Remove order success',
  REMOVE_ORDER_FAILURE = '[Order] Remove order failure',
}

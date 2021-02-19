import {createFeatureSelector, createSelector} from "@ngrx/store";
import {OrdersStateInterface} from "../types/ordersState.interface";

export const ordersFeatureSelectors = createFeatureSelector<
  OrdersStateInterface
  >('orders');

export const ordersSelector = createSelector(
  ordersFeatureSelectors,
  (ordersState: OrdersStateInterface) => ordersState.data
);

export const isLoadingOrdersSelector = createSelector(
  ordersFeatureSelectors,
  (ordersState: OrdersStateInterface) => ordersState.isLoading
);

export const isSubmittingOrdersSelector = createSelector(
  ordersFeatureSelectors,
  (ordersState: OrdersStateInterface) => ordersState.isSubmitting
);

export const errorOrdersSelector = createSelector(
  ordersFeatureSelectors,
  (ordersState: OrdersStateInterface) => ordersState.error
);

export const successOrdersSelector = createSelector(
  ordersFeatureSelectors,
  (ordersState: OrdersStateInterface) => ordersState.success
);

export const currentOrderSelector = createSelector(
  ordersFeatureSelectors,
  (ordersState: OrdersStateInterface) => ordersState.currentOrder
);

export const countOrdersSelector = createSelector(
  ordersFeatureSelectors,
  (ordersState: OrdersStateInterface) => ordersState.count
);

import {createFeatureSelector, createSelector} from "@ngrx/store";
import {CustomersStateInterface} from "../types/customersState.interface";

export const customersFeatureSelectors = createFeatureSelector<
  CustomersStateInterface
  >('customers');

export const customersSelector = createSelector(
  customersFeatureSelectors,
  (customersState: CustomersStateInterface) => customersState.data
);

export const isLoadingCustomersSelector = createSelector(
  customersFeatureSelectors,
  (customersState: CustomersStateInterface) => customersState.isLoading
);

export const errorCustomersSelector = createSelector(
  customersFeatureSelectors,
  (customersState: CustomersStateInterface) => customersState.error
);

export const successCustomersSelector = createSelector(
  customersFeatureSelectors,
  (customersState: CustomersStateInterface) => customersState.success
);

export const currentCustomerSelector = createSelector(
  customersFeatureSelectors,
  (customersState: CustomersStateInterface) => customersState.currentCustomer
);

export const countCustomersSelector = createSelector(
  customersFeatureSelectors,
  (customersState: CustomersStateInterface) => customersState.count
);

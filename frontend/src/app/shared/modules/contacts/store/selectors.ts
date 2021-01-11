import {createFeatureSelector, createSelector} from "@ngrx/store";
import {ContactsStateInterface} from "../types/contactsState.interface";

export const contactsFeatureSelector = createFeatureSelector<
    ContactsStateInterface
  >('contacts');

export const contactsSelector = createSelector(
  contactsFeatureSelector,
  (contactsState: ContactsStateInterface) => contactsState.data
);

export const isLoadingContactsSelector = createSelector(
  contactsFeatureSelector,
  (contactsState: ContactsStateInterface) => contactsState.isLoading
);

export const errorContactsSelector = createSelector(
  contactsFeatureSelector,
  (contactsState: ContactsStateInterface) => contactsState.error
);

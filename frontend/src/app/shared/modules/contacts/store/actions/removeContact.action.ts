import {createAction, props} from "@ngrx/store";
import {ActionTypes} from "../actionTypes";
import {BackendMessagesInterface} from "../../../../types/backendMessages.interface";

export const removeContactAction = createAction(
  ActionTypes.REMOVE_CONTACT,
  props<{ id: string }>()
);

export const removeContactSuccessAction = createAction(
  ActionTypes.REMOVE_CONTACT_SUCCESS,
  props<{message: BackendMessagesInterface, id: string}>()
);

export const removeContactFailureAction = createAction(
  ActionTypes.REMOVE_CONTACT_FAILURE
);

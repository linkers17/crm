import {ActionReducerMap} from "@ngrx/store";
import {RouterStateInterface} from "./routerState.interface";
import {DEFAULT_ROUTER_FEATURENAME, routerReducer} from "@ngrx/router-store";

export const reducer: ActionReducerMap<RouterStateInterface> = {
  [DEFAULT_ROUTER_FEATURENAME]: routerReducer
};

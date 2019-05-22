import { History } from "history";
import { History as reachHistory } from "@reach/router";
import { Action, Middleware, Reducer, Store } from "redux";

declare function createReduxHistory(store: Store): History;

export interface IrrHistory {
  _onTransitionComplete: () => void;
  listen: (listener: any) => any;
  navigate: (to: any, ...args: any[]) => any;
}

export interface IHistoryContextOptions {
  history: History;
  routerReducerKey?: string;
  oldLocationChangePayload?: boolean;
  reduxTravelling?: boolean;
  showHistoryAction?: boolean;
  selectRouterState?: any,
}

export interface IHistoryContext {
  createReduxHistory: typeof createReduxHistory;
  routerMiddleware: Middleware;
  routerReducer: Reducer;
}

export function createReduxHistoryContext(options: IHistoryContextOptions): IHistoryContext;

export function reachify(reduxHistory: History<any>): reachHistory;

export const push: (to: any) => Action;
export const replace : (to: any) => Action;
export const go : (to: any) => Action;
export const goBack  : (to: any) => Action;
export const goForward  : (to: any) => Action;

export const CALL_HISTORY_METHOD = '@@router/CALL_HISTORY_METHOD';
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';

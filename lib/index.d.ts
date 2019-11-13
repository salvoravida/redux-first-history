import { History, Location, Action as RouterActionType } from "history";
import { History as reachHistory } from "reach__router";
import { Action as ReduxAction, Middleware, Reducer, Store } from "redux";

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

export const push: (to: any) => ReduxAction;
export const replace : (to: any) => ReduxAction;
export const go : (to: any) => ReduxAction;
export const goBack  : (to: any) => ReduxAction;
export const goForward  : (to: any) => ReduxAction;

export interface RouterState {
  location: Location;
  action: RouterActionType;
}

export const CALL_HISTORY_METHOD = '@@router/CALL_HISTORY_METHOD';
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';

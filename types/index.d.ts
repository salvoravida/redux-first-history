import { History, Location, Action as RouterActionType } from 'history';
import { History as ReachHistory } from 'reach__router';
import { Action as ReduxAction, Middleware, Reducer, Store } from 'redux';

declare function createReduxHistory(store: Store): History;

export interface IHistoryContextOptions {
  history: History;
  routerReducerKey?: string;
  oldLocationChangePayload?: boolean;
  reduxTravelling?: boolean;
  showHistoryAction?: boolean;
  selectRouterState?: (state: any) => any;
  savePreviousLocations?: number;
  batch?: (callback: () => any) => void;
  reachGlobalHistory?: ReachHistory;
}

export interface IHistoryContext {
  createReduxHistory: typeof createReduxHistory;
  routerMiddleware: Middleware;
  routerReducer: Reducer;
}

export function createReduxHistoryContext(options: IHistoryContextOptions): IHistoryContext;

export function reachify(reduxHistory: History<any>): ReachHistory;

export const push: (to: any) => ReduxAction;
export const replace: (to: any) => ReduxAction;
export const go: (to: any) => ReduxAction;
export const goBack: (to: any) => ReduxAction;
export const goForward: (to: any) => ReduxAction;

export interface RouterState {
  location: Location;
  action: RouterActionType;
}

export const CALL_HISTORY_METHOD = '@@router/CALL_HISTORY_METHOD';
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';

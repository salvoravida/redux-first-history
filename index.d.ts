import { History } from "history";
import { Action, Middleware, Reducer, Store } from "redux";

declare function createReduxHistory(store: Store): History;

export interface IrrHistory {
  _onTransitionComplete: () => void;
  listen: (listener: any) => any;
  navigate: (to: any, ...args: any[]) => any;
}
declare function reachify(reduxHistory: History<any>): IrrHistory;

export interface IHistoryContextOptions {
  history: History;
  routerReducerKey?: string;
  oldLocationChangePayload?: boolean;
  reduxTravelling?: boolean;
}

export interface IHistoryContext {
  createReduxHistory: typeof createReduxHistory;
  routerMiddleware: Middleware;
  routerReducer: Reducer;
}

export function createReduxHistoryContext(
  options: IHistoryContextOptions
): IHistoryContext;
export const push: (to: string) => Action;

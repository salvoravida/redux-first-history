import { History } from "history";
import { Action, Middleware, Reducer, Store } from "redux";
import { Overwrite } from "type-zoo/types";

declare function createReduxHistory(store: Overwrite<Store, any>): History;

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

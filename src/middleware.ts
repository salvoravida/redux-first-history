/* eslint-disable consistent-return */
import { History } from 'history';
import { AnyAction as ReduxAction, Dispatch, Middleware } from 'redux';
import { CALL_HISTORY_METHOD, HistoryMethods, updateLocation } from './actions';

type CreateRouterMiddlewareArgs = {
   history: History;
   showHistoryAction: boolean;
};

export const createRouterMiddleware = ({
   history,
   showHistoryAction,
}: CreateRouterMiddlewareArgs): Middleware => () => (next: Dispatch) => (action: ReduxAction) => {
   if (action.type !== CALL_HISTORY_METHOD) {
      return next(action);
   }
   const method = action.payload.method as HistoryMethods;
   const args = action.payload.args as Parameters<ReturnType<typeof updateLocation>>;
   const historyMethod = history[method];

   historyMethod(...args);
   if (showHistoryAction) return next(action);
};

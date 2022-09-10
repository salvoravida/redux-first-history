/* eslint-disable consistent-return,indent */
import { History } from 'history';
import { AnyAction as ReduxAction, Dispatch, Middleware } from 'redux';
import { CALL_HISTORY_METHOD, HistoryMethods } from './actions';

type CreateRouterMiddlewareArgs = {
   history: History;
   showHistoryAction: boolean;
   basename?: string;
};

function appendBasename(location: string | Location, basename: string): string | Location {
   if (typeof location === 'string' && !location.startsWith(basename)) {
      return basename + location;
   }
   if (
      typeof location === 'object' &&
      !!location.pathname &&
      !location.pathname.startsWith(basename)
   ) {
      return { ...location, pathname: basename + location.pathname };
   }
   return location;
}

export const createRouterMiddleware =
   ({ history, showHistoryAction, basename }: CreateRouterMiddlewareArgs): Middleware =>
   () =>
   (next: Dispatch) =>
   (action: ReduxAction) => {
      if (action.type !== CALL_HISTORY_METHOD) {
         return next(action);
      }
      const method = action.payload.method as HistoryMethods;
      // @ts-ignore
      const args = action.payload.args as Parameters<History[HistoryMethods]>;

      // eslint-disable-next-line default-case
      switch (method) {
         case 'push': {
            let callArgs = args;
            if (basename && args.length > 0) {
               callArgs = [
                  appendBasename(args[0] as string | Location, basename),
                  ...args.slice(1),
               ];
            }
            history.push(...(callArgs as Parameters<History['push']>));
            break;
         }
         case 'replace': {
            let callArgs = args;
            if (basename && args.length > 0) {
               callArgs = [
                  appendBasename(args[0] as string | Location, basename),
                  ...args.slice(1),
               ];
            }
            history.replace(...(callArgs as Parameters<History['replace']>));
            break;
         }
         case 'go':
            history.go(...(args as Parameters<History['go']>));
            break;
         case 'back':
         case 'goBack':
            // @ts-ignore
            history.goBack && history.goBack(...(args as Parameters<History['goBack']>));
            //@ts-ignore //support history 5.x
            history.back && history.back(...(args as Parameters<History['back']>));
            break;
         case 'forward':
         case 'goForward':
            // @ts-ignore
            history.goForward && history.goForward(...(args as Parameters<History['goForward']>));
            //@ts-ignore //support history 5.x
            history.forward && history.forward(...(args as Parameters<History['forward']>));
            break;
      }
      if (showHistoryAction) return next(action);
   };

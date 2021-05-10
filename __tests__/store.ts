import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createBrowserHistory } from 'history';
import { globalHistory } from '@reach/router';
import { createReduxHistoryContext, IHistoryContextOptions, reachify } from '../src';

export const createTestEnv = (
   options?: Omit<IHistoryContextOptions, 'history'>,
   listenObject?: boolean,
) => {
   const originalHistory = createBrowserHistory();

   // @ts-ignore
   const history = {
      ...originalHistory,
      go: jest.fn(originalHistory.go),
      goBack: jest.fn(originalHistory.goBack),
      goForward: jest.fn(originalHistory.goForward),
      push: jest.fn(originalHistory.push),
      replace: jest.fn(originalHistory.replace),
   };

   if (listenObject) {
      history.listen = jest.fn(callback =>
         // @ts-ignore
         originalHistory.listen((location, action) => callback({ location, action })),
      );
   }

   const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
      ...options,
      history,
      reachGlobalHistory: globalHistory,
   });

   const store = createStore(
      combineReducers({
         router: routerReducer,
      }),
      applyMiddleware(routerMiddleware),
   );

   const reduxHistory = createReduxHistory(store);
   const reachHistory = reachify(reduxHistory);

   return {
      store,
      history,
      reduxHistory,
      reachHistory,
   };
};

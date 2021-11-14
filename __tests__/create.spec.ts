import { createBrowserHistory, History } from 'history';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { globalHistory } from '@reach/router';
import { createReduxHistoryContext, reachify } from '../src';

describe('Context', () => {
   it('create ReduxFirstHistory context - middleware - router', () => {
      const history = createBrowserHistory();
      const batch = jest.fn(callback => {
         callback();
      });

      const fakeHistory = {
         ...history,
         // @ts-ignore
         back: jest.fn(history.back),
         // @ts-ignore
         forward: jest.fn(history.forward),
         goBack: jest.fn(history.goBack),
         go: jest.fn(history.go),
         goForward: jest.fn(history.goForward),
         push: jest.fn(history.push),
         replace: jest.fn(history.replace),
      } as unknown as History;
      const { routerMiddleware, routerReducer, createReduxHistory } = createReduxHistoryContext({
         history: fakeHistory,
         batch,
      });
      const store = createStore(
         combineReducers({ router: routerReducer }),
         applyMiddleware(routerMiddleware),
      );
      const reduxHistory = createReduxHistory(store);
      store.dispatch = jest.fn(store.dispatch);
      expect(store.dispatch).toHaveBeenCalledTimes(0);
      expect(batch).toHaveBeenCalledTimes(0);

      reduxHistory.push('/push');
      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(batch).toHaveBeenCalledTimes(1);
      expect(fakeHistory.push).toHaveBeenCalledTimes(1);
      expect(fakeHistory.replace).toHaveBeenCalledTimes(0);
      expect(store.getState().router.location).toBe(reduxHistory.location);
      expect(store.getState().router.action).toBe(reduxHistory.action);
      expect(store.getState().router.location?.pathname).toBe('/push');

      reduxHistory.replace('/replace');
      expect(store.dispatch).toHaveBeenCalledTimes(4);
      expect(batch).toHaveBeenCalledTimes(2);
      expect(fakeHistory.replace).toHaveBeenCalledTimes(1);
      expect(store.getState().router.location).toBe(reduxHistory.location);
      expect(store.getState().router.action).toBe(reduxHistory.action);
      expect(fakeHistory.length).toBe(reduxHistory.length);
      expect(store.getState().router.location?.pathname).toBe('/replace');

      reduxHistory.goBack();
      expect(store.dispatch).toHaveBeenCalledTimes(5);
      expect(fakeHistory.goBack).toHaveBeenCalledTimes(1);
      reduxHistory.goForward();
      expect(store.dispatch).toHaveBeenCalledTimes(6);
      expect(fakeHistory.goForward).toHaveBeenCalledTimes(1);
      reduxHistory.go(-1);
      expect(store.dispatch).toHaveBeenCalledTimes(7);
      expect(fakeHistory.go).toHaveBeenCalledTimes(1);

      //@ts-ignore
      reduxHistory.back();
      expect(store.dispatch).toHaveBeenCalledTimes(8);
      //@ts-ignore
      expect(fakeHistory.back).toHaveBeenCalledTimes(2);
      //@ts-ignore
      reduxHistory.forward();
      expect(store.dispatch).toHaveBeenCalledTimes(9);
      //@ts-ignore
      expect(fakeHistory.forward).toHaveBeenCalledTimes(2);
   });

   it('create ReduxFirstHistory context - middleware - router (with advanced options)', () => {
      const history = createBrowserHistory();
      const batch = jest.fn(callback => {
         callback();
      });
      const fakeHistory = {
         ...history,
         goBack: jest.fn(history.goBack),
         go: jest.fn(history.go),
         goForward: jest.fn(history.goForward),
         push: jest.fn(history.push),
         replace: jest.fn(history.replace),
      } as unknown as History;
      const { routerMiddleware, routerReducer, createReduxHistory } = createReduxHistoryContext({
         history: fakeHistory,
         batch,
         showHistoryAction: true,
         routerReducerKey: 'myRouter',
         selectRouterState: (s: any) => s.myRouter,
         savePreviousLocations: 10,
      });
      const store = createStore(
         combineReducers({ myRouter: routerReducer }),
         applyMiddleware(routerMiddleware),
      );
      const reduxHistory = createReduxHistory(store);
      store.dispatch = jest.fn(store.dispatch);
      expect(store.dispatch).toHaveBeenCalledTimes(0);
      expect(batch).toHaveBeenCalledTimes(0);

      reduxHistory.push('/push');
      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(batch).toHaveBeenCalledTimes(1);
      expect(fakeHistory.push).toHaveBeenCalledTimes(1);
      expect(fakeHistory.replace).toHaveBeenCalledTimes(0);
      expect(store.getState().myRouter.location).toBe(reduxHistory.location);
      expect(store.getState().myRouter.action).toBe(reduxHistory.action);
      expect(store.getState().myRouter.location?.pathname).toBe('/push');

      reduxHistory.replace('/replace');
      expect(store.dispatch).toHaveBeenCalledTimes(4);
      expect(batch).toHaveBeenCalledTimes(2);
      expect(fakeHistory.replace).toHaveBeenCalledTimes(1);
      expect(store.getState().myRouter.location).toBe(reduxHistory.location);
      expect(store.getState().myRouter.action).toBe(reduxHistory.action);
      expect(fakeHistory.length).toBe(reduxHistory.length);
      expect(store.getState().myRouter.location?.pathname).toBe('/replace');

      reduxHistory.goBack();
      expect(store.dispatch).toHaveBeenCalledTimes(5);
      expect(fakeHistory.goBack).toHaveBeenCalledTimes(1);
      reduxHistory.goForward();
      expect(store.dispatch).toHaveBeenCalledTimes(6);
      expect(fakeHistory.goForward).toHaveBeenCalledTimes(1);
      reduxHistory.go(-1);
      expect(store.dispatch).toHaveBeenCalledTimes(7);
      expect(fakeHistory.go).toHaveBeenCalledTimes(1);
   });

   it('create ReduxFirstHistory context - middleware - router - listenObject', () => {
      const history = createBrowserHistory();
      const batch = jest.fn(callback => {
         callback();
      });
      const fakeHistory = {
         ...history,
         push: jest.fn(history.push),
         replace: jest.fn(history.replace),
         listen: jest.fn(callback =>
            history.listen((location, action) => callback({ location, action })),
         ),
      } as unknown as History;
      const { routerMiddleware, routerReducer, createReduxHistory } = createReduxHistoryContext({
         history: fakeHistory,
         batch,
      });
      const store = createStore(
         combineReducers({ router: routerReducer }),
         applyMiddleware(routerMiddleware),
      );
      const reduxHistory = createReduxHistory(store);
      store.dispatch = jest.fn(store.dispatch);
      expect(store.dispatch).toHaveBeenCalledTimes(0);
      expect(batch).toHaveBeenCalledTimes(0);

      reduxHistory.push('/push');
      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(batch).toHaveBeenCalledTimes(1);
      expect(fakeHistory.push).toHaveBeenCalledTimes(1);
      expect(store.getState().router.location).toBe(reduxHistory.location);
      expect(store.getState().router.action).toBe(reduxHistory.action);

      reduxHistory.replace('/replace');
      expect(store.dispatch).toHaveBeenCalledTimes(4);
      expect(batch).toHaveBeenCalledTimes(2);
      expect(fakeHistory.push).toHaveBeenCalledTimes(1);
      expect(fakeHistory.replace).toHaveBeenCalledTimes(1);
      expect(store.getState().router.location).toBe(reduxHistory.location);
      expect(store.getState().router.action).toBe(reduxHistory.action);
      expect(fakeHistory.length).toBe(reduxHistory.length);

      expect(reduxHistory.listenObject).toBe(true);
   });

   it('create ReduxFirstHistory context - middleware - router - reachHistory', () => {
      const history = createBrowserHistory();
      const fakeHistory = {
         ...history,
         push: jest.fn(history.push),
         replace: jest.fn(history.replace),
         listen: jest.fn(callback =>
            history.listen((location, action) => callback({ location, action })),
         ),
      } as unknown as History;
      const { routerMiddleware, routerReducer, createReduxHistory } = createReduxHistoryContext({
         history: fakeHistory,
         reachGlobalHistory: globalHistory,
      });
      const store = createStore(
         combineReducers({ router: routerReducer }),
         applyMiddleware(routerMiddleware),
      );
      const reduxHistory = createReduxHistory(store);
      const reachHistory = reachify(reduxHistory);

      let spyListen;
      const listenCallback = jest.fn((location, action) => {
         spyListen = { location, action };
      });
      reduxHistory.listen(listenCallback);

      store.dispatch = jest.fn(store.dispatch);
      expect(store.dispatch).toHaveBeenCalledTimes(0);

      globalHistory.navigate('/push');
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(fakeHistory.push).toHaveBeenCalledTimes(0);
      expect(store.getState().router.location).toBe(reduxHistory.location);
      expect(store.getState().router.action).toBe(reduxHistory.action);
      expect(reduxHistory.listenObject).toBe(false);

      expect(spyListen.location.pathname).toEqual('/push');
      expect(spyListen.action).toEqual('PUSH');

      reachHistory.navigate('/navigate');
      expect(store.dispatch).toHaveBeenCalledTimes(3);
      expect(fakeHistory.push).toHaveBeenCalledTimes(1);
      expect(store.getState().router.location).toBe(reduxHistory.location);
      expect(store.getState().router.action).toBe(reduxHistory.action);
      expect(reduxHistory.listenObject).toBe(true);

      reachHistory.navigate('/navigate2', { replace: true });
      expect(store.dispatch).toHaveBeenCalledTimes(5);
      expect(fakeHistory.replace).toHaveBeenCalledTimes(1);
      expect(store.getState().router.location).toBe(reduxHistory.location);
      expect(store.getState().router.location).toBe(reachHistory.location);
      expect(store.getState().router.action).toBe(reduxHistory.action);
      expect(reduxHistory.listenObject).toBe(true);
      expect(reachHistory.transitioning).toBe(true);
   });

   it('reduxFirstHistory listen test', () => {
      const history = createBrowserHistory();
      const fakeHistory = {
         ...history,
         push: jest.fn(history.push),
         replace: jest.fn(history.replace),
      } as unknown as History;
      const { routerMiddleware, routerReducer, createReduxHistory } = createReduxHistoryContext({
         history: fakeHistory,
         reachGlobalHistory: globalHistory,
      });
      const store = createStore(
         combineReducers({ router: routerReducer }),
         applyMiddleware(routerMiddleware),
      );
      const reduxHistory = createReduxHistory(store);
      store.dispatch = jest.fn(store.dispatch);
      expect(store.dispatch).toHaveBeenCalledTimes(0);

      let spyListen;
      const listenCallback = jest.fn((location, action) => {
         spyListen = { location, action };
      });
      const unsub = reduxHistory.listen(listenCallback);

      fakeHistory.push('/push');
      expect(listenCallback).toHaveBeenCalledTimes(1);
      expect(store.getState().router.location).toBe(reduxHistory.location);
      expect(store.getState().router.action).toBe(reduxHistory.action);

      expect(spyListen.location.pathname).toEqual('/push');
      expect(spyListen.action).toEqual('PUSH');

      unsub();

      fakeHistory.replace('/replace');
      expect(listenCallback).toHaveBeenCalledTimes(1);
      expect(store.getState().router.location).toBe(reduxHistory.location);
      expect(store.getState().router.action).toBe(reduxHistory.action);

      expect(spyListen.location.pathname).toEqual('/push');
      expect(spyListen.action).toEqual('PUSH');
   });

   it('reduxFirstHistory redux travelling', () => {
      const history = createBrowserHistory();
      const fakeHistory = {
         ...history,
         push: jest.fn(history.push),
         replace: jest.fn(history.replace),
      } as unknown as History;
      const { routerMiddleware, routerReducer, createReduxHistory } = createReduxHistoryContext({
         history: fakeHistory,
         reduxTravelling: true,
      });
      const store = createStore(
         combineReducers({ router: routerReducer }),
         applyMiddleware(routerMiddleware),
      );
      const reduxHistory = createReduxHistory(store);
      store.dispatch = jest.fn(store.dispatch);
      expect(store.dispatch).toHaveBeenCalledTimes(0);

      let spyListen;
      const listenCallback = jest.fn((location, action) => {
         spyListen = { location, action };
      });
      reduxHistory.listen(listenCallback);

      fakeHistory.push('/push');
      expect(listenCallback).toHaveBeenCalledTimes(2);
      expect(store.getState().router.location).toBe(reduxHistory.location);
      expect(store.getState().router.action).toBe(reduxHistory.action);

      expect(spyListen.location.pathname).toEqual('/push');
      expect(spyListen.action).toEqual('PUSH');

      reduxHistory.replace('/replace');
      expect(listenCallback).toHaveBeenCalledTimes(3);
      expect(store.getState().router.location).toBe(reduxHistory.location);
      expect(store.getState().router.action).toBe(reduxHistory.action);

      expect(spyListen.location.pathname).toEqual('/replace');
      expect(spyListen.action).toEqual('REPLACE');
   });
});

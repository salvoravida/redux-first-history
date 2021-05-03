import { combineReducers, createStore } from 'redux';
import { LOCATION_CHANGE, CALL_HISTORY_METHOD, push, replace, go, goBack, goForward } from '../src';
import { createRouterReducer } from '../src/reducer';

describe('RouterReducer', () => {
   it('create route reducer without previousLocations', () => {
      const routerReducer = createRouterReducer({});
      let routerState = routerReducer(undefined, { type: 'tst' });

      expect(routerState).toEqual({ location: null, action: null });
      routerState = routerReducer(routerState, push('/path'));
      expect(routerState).toEqual({
         location: { pathname: '/path' },
         action: 'PUSH',
         previousLocations: [],
      });
   });

   it('create route reducer with previousLocations', () => {
   /*   const store = createStore(
         combineReducers({ router: createRouterReducer({ savePreviousLocations: 2 }) }),
      );

      expect(store.getState().router).toEqual({
         location: null,
         action: null,
         previousLocations: [],
      });
      store.dispatch(push('/path'));
      console.log(store.getState().router);
      expect(store.getState().router).toEqual({
         location: { pathname: '/path' },
         action: 'PUSH',
         previousLocations: [],
      });*/
   });
});

import { createRouterReducer } from '../src/reducer';
import { LOCATION_CHANGE, locationChangeAction } from '../src/actions';

describe('RouterReducer', () => {
   describe('without previousLocations', () => {
      const initialState = { location: null, action: null };
      // @ts-ignore
      const routerReducer = createRouterReducer({});

      it('should return the initial state', () => {
         expect(routerReducer(undefined, { type: 'init' })).toEqual(initialState);
      });

      it('should return the initial state with NaN savePreviousLocations', () => {
         expect(
            // @ts-ignore
            createRouterReducer({ savePreviousLocations: 'nan' })(undefined, { type: 'init' }),
         ).toEqual(initialState);
      });

      it('should handle undefined payload', () => {
         expect(routerReducer(undefined, { type: LOCATION_CHANGE })).toEqual({});
      });

      it('should handle undefined action', () => {
         // @ts-ignore
         expect(routerReducer(undefined, undefined)).toEqual(initialState);
      });

      it('should handle locationChangeAction', () => {
         const newLocation = {
            pathname: '/path',
            search: '',
            hash: '',
            state: undefined,
            key: '0h2353',
         };
         const nextRouterState = routerReducer(
            undefined,
            locationChangeAction(newLocation, 'PUSH'),
         );
         expect(nextRouterState).toEqual({
            location: newLocation,
            action: 'PUSH',
         });
      });
   });

   describe('with previousLocations', () => {
      const initialState = { location: null, action: null, previousLocations: [] };
      const routerReducer = createRouterReducer({ savePreviousLocations: 1 });

      it('should return the initial state', () => {
         expect(routerReducer(undefined, { type: 'init' })).toEqual(initialState);
      });

      it('should handle undefined payload', () => {
         expect(routerReducer(undefined, { type: LOCATION_CHANGE })).toEqual({
            previousLocations: [{}],
         });
      });

      it('should handle undefined action', () => {
         // @ts-ignore
         expect(routerReducer(undefined, undefined)).toEqual(initialState);
      });

      it('should handle locationChangeAction', () => {
         const newLocation = (index: number) => ({
            pathname: `/path${index}`,
            search: '',
            hash: '',
            state: undefined,
            key: '0h2353',
         });
         const routerState = routerReducer(undefined, { type: 'init' });
         let nextRouterState = routerReducer(
            routerState,
            locationChangeAction(newLocation(1), 'PUSH'),
         );
         nextRouterState = routerReducer(
            nextRouterState,
            locationChangeAction(newLocation(2), 'PUSH'),
         );
         nextRouterState = routerReducer(
            nextRouterState,
            locationChangeAction(newLocation(3), 'PUSH'),
         );
         const expectedState = {
            location: newLocation(3),
            action: 'PUSH',
            previousLocations: [
               locationChangeAction(newLocation(3), 'PUSH').payload,
               locationChangeAction(newLocation(2), 'PUSH').payload,
            ],
         };
         expect(nextRouterState).toEqual(expectedState);
      });
   });
});

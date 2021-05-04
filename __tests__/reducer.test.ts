import { createRouterReducer } from '../src/reducer';
import { locationChangeAction } from '../src/actions';

describe('RouterReducer', () => {
   it('create route reducer without previousLocations', () => {
      const routerReducer = createRouterReducer({});
      const routerState = routerReducer(undefined, { type: 'init' });
      expect(routerState).toEqual({ location: null, action: null });
      const newLocation = {
         pathname: '/path',
         search: '',
         hash: '',
         state: undefined,
         key: '0h2353',
      };
      const nextRouterState = routerReducer(undefined, locationChangeAction(newLocation, 'PUSH'));
      expect(nextRouterState).toEqual({
         location: newLocation,
         action: 'PUSH',
      });
   });
   it('create route reducer with previousLocations', () => {
      const routerReducer = createRouterReducer({ savePreviousLocations: 1 });
      const routerState = routerReducer(undefined, { type: 'init' });
      expect(routerState).toEqual({ location: null, action: null, previousLocations: [] });
      const newLocation = (index: number) => ({
         pathname: `/path${index}`,
         search: '',
         hash: '',
         state: undefined,
         key: '0h2353',
      });
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

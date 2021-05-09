import { LOCATION_CHANGE, CALL_HISTORY_METHOD, push, replace, go, goBack, goForward } from '../src';
import { locationChangeAction } from '../src/actions';

describe('Actions', () => {
   it('should create correct action when calling locationChangeAction()', () => {
      const actualAction = locationChangeAction<undefined>(
         { pathname: '/', search: '', hash: '', state: undefined },
         'POP',
      );
      const expectedAction = {
         type: LOCATION_CHANGE,
         payload: {
            location: {
               pathname: '/',
               search: '',
               hash: '',
            },
            action: 'POP',
         },
      };
      expect(actualAction).toEqual(expectedAction);
   });

   it('should create correct action when calling push()', () => {
      const actualAction = push('/path/to/somewhere');
      const expectedAction = {
         type: CALL_HISTORY_METHOD,
         payload: {
            method: 'push',
            args: ['/path/to/somewhere'],
         },
      };
      expect(actualAction).toEqual(expectedAction);
   });

   it('should create correct action when calling replace()', () => {
      const actualAction = replace('/path/to/somewhere');
      const expectedAction = {
         type: CALL_HISTORY_METHOD,
         payload: {
            method: 'replace',
            args: ['/path/to/somewhere'],
         },
      };
      expect(actualAction).toEqual(expectedAction);
   });

   it('should create correct action when calling go()', () => {
      const actualAction = go(2);
      const expectedAction = {
         type: CALL_HISTORY_METHOD,
         payload: {
            method: 'go',
            args: [2],
         },
      };
      expect(actualAction).toEqual(expectedAction);
   });

   it('should create correct action when calling goBack()', () => {
      const actualAction = goBack();
      const expectedAction = {
         type: CALL_HISTORY_METHOD,
         payload: {
            method: 'goBack',
            args: [],
         },
      };
      expect(actualAction).toEqual(expectedAction);
   });

   it('should create correct action when calling goForward()', () => {
      const actualAction = goForward();
      const expectedAction = {
         type: CALL_HISTORY_METHOD,
         payload: {
            method: 'goForward',
            args: [],
         },
      };
      expect(actualAction).toEqual(expectedAction);
   });
});

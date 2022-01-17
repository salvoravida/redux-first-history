import { Location, Action, History } from 'history';
import { AnyAction as ReduxAction } from 'redux';

export const CALL_HISTORY_METHOD = '@@router/CALL_HISTORY_METHOD';
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';

//support history v4/ v5
export type HistoryMethods =
   | 'push'
   | 'replace'
   | 'go'
   | 'goBack'
   | 'goForward'
   | 'back'
   | 'forward';

export const locationChangeAction = (location: Location, action: Action) => ({
   type: LOCATION_CHANGE,
   payload: { location, action },
});

function updateLocation<T extends HistoryMethods>(method: T) {
   // @ts-ignore
   return (...args: Parameters<History[T]>): ReduxAction => ({
      type: CALL_HISTORY_METHOD,
      payload: { method, args },
   });
}

export const push: (...args: Parameters<History['push']>) => ReduxAction = updateLocation('push');
export const replace: (...args: Parameters<History['replace']>) => ReduxAction =
   updateLocation('replace');
export const go: (...args: Parameters<History['go']>) => ReduxAction = updateLocation('go');
export const goBack: () => ReduxAction = updateLocation('goBack');
export const goForward: () => ReduxAction = updateLocation('goForward');
export const back: () => ReduxAction = updateLocation('back');
export const forward: () => ReduxAction = updateLocation('forward');

export type RouterActions = 
   ReturnType<typeof push> | 
   ReturnType<typeof replace> |
   ReturnType<typeof go> | 
   ReturnType<typeof goBack> | 
   ReturnType<typeof goForward> | 
   ReturnType<typeof locationChangeAction> | 
   ReturnType<typeof back> |
   ReturnType<typeof forward>;
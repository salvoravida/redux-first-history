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

export const push = updateLocation('push');
export const replace = updateLocation('replace');
export const go = updateLocation('go');
export const goBack = updateLocation('goBack');
export const goForward = updateLocation('goForward');
export const back = updateLocation('back');
export const forward = updateLocation('forward');

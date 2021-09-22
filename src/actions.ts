import { Location, Action, History } from 'history';
import { AnyAction as ReduxAction } from 'redux';

export const CALL_HISTORY_METHOD = '@@router/CALL_HISTORY_METHOD';
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';

export type HistoryMethods = 'push' | 'replace' | 'go' | 'goBack' | 'goForward';

export const locationChangeAction = <T>(location: Location<T>, action: Action) => ({
   type: LOCATION_CHANGE,
   payload: { location, action },
});

function updateLocation(method: HistoryMethods) {
   return (...args: Parameters<History[HistoryMethods]>): ReduxAction => ({
      type: CALL_HISTORY_METHOD,
      payload: { method, args },
   });
}

export const push = updateLocation('push');
export const replace = updateLocation('replace');
export const go = updateLocation('go');
export const goBack = updateLocation('goBack');
export const goForward = updateLocation('goForward');

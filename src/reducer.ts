import { Action, Location } from 'history';
import { AnyAction, Reducer } from 'redux';
import { LOCATION_CHANGE } from './actions';

export type RouterState = {
   location?: Location | null;
   action?: Action | null;
   previousLocations?: { location?: Location | null; action?: Action | null }[];
   basename?: string;
};

export const createRouterReducer = ({
   savePreviousLocations = 0,
   basename,
}: {
   savePreviousLocations?: number;
   basename?: string;
}): Reducer<RouterState> => {
   const initialState: RouterState = {
      location: null,
      action: null,
      basename,
   };

   // eslint-disable-next-line no-restricted-globals
   const numLocationToTrack = isNaN(savePreviousLocations) ? 0 : savePreviousLocations;
   if (numLocationToTrack) initialState.previousLocations = [];

   return (state = initialState, { type, payload } = {} as AnyAction) => {
      if (type === LOCATION_CHANGE) {
         const { location, action } = payload || {};
         const previousLocations = numLocationToTrack // @ts-ignore
            ? [{ location, action }, ...state.previousLocations.slice(0, numLocationToTrack)]
            : undefined;
         return { ...state, location, action, previousLocations };
      }
      return state;
   };
};

import { LOCATION_CHANGE } from './actions';

export const createRouterReducer = ({ oldLocationChangePayload = false, savePreviousLocations = 0 }) => {
  const initialState = {
    location: null,
    action: null,
  };

  // eslint-disable-next-line no-restricted-globals
  const numLocationToTrack = isNaN(savePreviousLocations) ? 0 : savePreviousLocations;
  if (numLocationToTrack) initialState.previousLocations = [];

  return (state = initialState, { type, payload } = {}) => {
    if (type === LOCATION_CHANGE) {
      if (oldLocationChangePayload) {
        const { action, ...location } = payload || {};
        const previousLocations = numLocationToTrack
          ? [{ location, action }, ...state.previousLocations.slice(0, numLocationToTrack)]
          : undefined;
        return { ...state, location, action, previousLocations };
      }
      const { location, action } = payload || {};
      const previousLocations = numLocationToTrack
        ? [{ location, action }, ...state.previousLocations.slice(0, numLocationToTrack)]
        : undefined;
      return { ...state, location, action, previousLocations };
    }
    return state;
  };
};

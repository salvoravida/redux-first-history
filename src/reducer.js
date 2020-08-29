import { LOCATION_CHANGE } from './actions';

export const createRouterReducer = ({ savePreviousLocations = 0 }) => {
  const initialState = {
    location: null,
    action: null,
  };

  // eslint-disable-next-line no-restricted-globals
  const numLocationToTrack = isNaN(savePreviousLocations) ? 0 : savePreviousLocations;
  if (numLocationToTrack) initialState.previousLocations = [];

  return (state = initialState, { type, payload } = {}) => {
    if (type === LOCATION_CHANGE) {
      const { location, action } = payload || {};
      const previousLocations = numLocationToTrack
        ? [{ location, action }, ...state.previousLocations.slice(0, numLocationToTrack)]
        : undefined;
      return { ...state, location, action, previousLocations };
    }
    return state;
  };
};

/** ***********************************************  reachify     ***************************************************** */

export const reachify = reduxHistory => {
  let transitioning = false;
  let resolveTransition = () => {};

  const rrHistory = {
    // eslint-disable-next-line no-underscore-dangle
    _onTransitionComplete() {
      transitioning = false;
      resolveTransition();
    },

    listen(listener) {
      return reduxHistory.listen((location, action) => listener({ location, action }));
    },

    navigate(to, { state, replace = false } = {}) {
      if (transitioning || replace) {
        reduxHistory.replace(to, state);
      } else {
        reduxHistory.push(to, state);
      }
      transitioning = true;
      return new Promise(res => (resolveTransition = res));
    }
  };

  Object.defineProperty(rrHistory, 'location', {
    get() {
      return reduxHistory.location;
    }
  });

  Object.defineProperty(rrHistory, 'transitioning', {
    get() {
      return transitioning;
    }
  });

  return rrHistory;
};

/** ***********************************************  REDUX ACTIONS **************************************************** */

export const CALL_HISTORY_METHOD = '@@router/CALL_HISTORY_METHOD';
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';

const updateLocation = method => (...args) => ({
  type: CALL_HISTORY_METHOD,
  payload: { method, args }
});

export const push = updateLocation('push');
export const replace = updateLocation('replace');
export const go = updateLocation('go');
export const goBack = updateLocation('goBack');
export const goForward = updateLocation('goForward');

/** ***********************************************  CONTEXT  ********************************************************* */

export const createReduxHistoryContext = ({
  history,
  routerReducerKey = 'router',
  oldLocationChangePayload = false,
  reduxTravelling = false,
  showHistoryAction = false,
  selectRouterState = null,
  savePreviousLocations = 0,
  batch = null
}) => {
  /** ********************************************  REDUX REDUCER ***************************************************** */
  if (typeof batch !== 'function') {
    batch = fn => {
      fn();
    };
  }

  if (typeof selectRouterState !== 'function') {
    selectRouterState = state => state[routerReducerKey];
  }

  const locationChangeAction = (location, action) => ({
    type: LOCATION_CHANGE,
    payload: oldLocationChangePayload ? { ...location, action } : { location, action }
  });

  const initialState = {
    location: null,
    action: null
  };

  const numLocationToTrack = isNaN(savePreviousLocations) ? 0 : savePreviousLocations;
  if (numLocationToTrack) initialState.previousLocations = [];

  const routerReducer = (state = initialState, { type, payload } = {}) => {
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

  /** *********************************************  REDUX MIDDLEWARE ************************************************* */

  // eslint-disable-next-line
  const routerMiddleware = () => next => action => {
    if (action.type !== CALL_HISTORY_METHOD) {
      return next(action);
    }
    const {
      payload: { method, args }
    } = action;
    history[method](...args);
    if (showHistoryAction) return next(action);
  };

  /** ******************************************  REDUX TRAVELLING  ************************************************** */

  let isReduxTravelling = false;

  const handleReduxTravelling = store => {
    const locationEqual = (loc1, loc2) =>
      loc1.pathname === loc2.pathname && loc1.search === loc2.search && loc1.hash === loc2.hash;

    return store.subscribe(() => {
      const sLoc = selectRouterState(store.getState()).location;
      const hLoc = history.location;
      if (sLoc && hLoc && !locationEqual(sLoc, hLoc)) {
        isReduxTravelling = true;
        history.push({ pathname: sLoc.pathname, search: sLoc.search, hash: sLoc.hash });
      }
    });
  };

  /** ******************************************  REDUX FIRST HISTORY   *********************************************** */

  const createReduxHistory = store => {
    if (reduxTravelling) {
      handleReduxTravelling(store);
    }

    let registeredCallback = [];

    // init location store
    store.dispatch(locationChangeAction(history.location, history.action));

    // listen to history API
    history.listen((location, action) => {
      if (isReduxTravelling) {
        isReduxTravelling = false;
        // notify registered callback travelling
        const routerState = selectRouterState(store.getState());
        registeredCallback.forEach(c => c(routerState.location, routerState.action));
        return;
      }
      batch(() => {
        store.dispatch(locationChangeAction(location, action));
        const routerState = selectRouterState(store.getState());
        registeredCallback.forEach(c => c(routerState.location, routerState.action));
      });
    });

    const reduxFirstHistory = {
      block: history.block,
      createHref: history.createHref,
      push: (...args) => store.dispatch(push(...args)),
      replace: (...args) => store.dispatch(replace(...args)),
      go: (...args) => store.dispatch(go(...args)),
      goBack: (...args) => store.dispatch(goBack(...args)),
      goForward: (...args) => store.dispatch(goForward(...args)),

      // listen tunnel
      listen: callback => {
        if (registeredCallback.indexOf(callback) < 0) {
          registeredCallback.push(callback);
        }
        return () => {
          registeredCallback = registeredCallback.filter(c => c !== callback);
        };
      }
    };

    // location tunnel
    Object.defineProperty(reduxFirstHistory, 'location', {
      get() {
        return selectRouterState(store.getState()).location;
      }
    });

    // action tunnel
    Object.defineProperty(reduxFirstHistory, 'action', {
      get() {
        return selectRouterState(store.getState()).action;
      }
    });

    // length tunnel
    Object.defineProperty(reduxFirstHistory, 'length', {
      get() {
        return history.length;
      }
    });

    return reduxFirstHistory;
  };

  return { routerReducer, routerMiddleware, createReduxHistory };
};

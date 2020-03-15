/** ***********************************************  reachify     ***************************************************** */

export const reachify = reduxHistory => {
  let transitioning = false;
  let resolveTransition = () => {};

  return {
    // eslint-disable-next-line no-underscore-dangle
    _onTransitionComplete() {
      transitioning = false;
      resolveTransition();
    },
    listen(listener) {
      if (reduxHistory.listenObject) {
        return reduxHistory.listen(listener);
      }
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
    },
    get location() {
      return reduxHistory.location;
    },
    get transitioning() {
      return transitioning;
    },
  };
};

/** ***********************************************  REDUX ACTIONS **************************************************** */

export const CALL_HISTORY_METHOD = '@@router/CALL_HISTORY_METHOD';
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';

const updateLocation = method => (...args) => ({
  type: CALL_HISTORY_METHOD,
  payload: { method, args },
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
  batch = null,
  reachGlobalHistory = null,
  listenObject = false,
}) => {
  const callListener = (listener, location, action) =>
    listenObject ? listener({ location, action }) : listener(location, action);

  if (typeof batch !== 'function') {
    batch = fn => {
      fn();
    };
  }

  /** ********************************************  REDUX REDUCER ***************************************************** */

  if (typeof selectRouterState !== 'function') {
    selectRouterState = state => state[routerReducerKey];
  }

  const locationChangeAction = (location, action) => ({
    type: LOCATION_CHANGE,
    payload: oldLocationChangePayload ? { ...location, action } : { location, action },
  });

  const initialState = {
    location: null,
    action: null,
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
      payload: { method, args },
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
      // support history v5
      if (location.location) {
        action = location.action;
        location = location.location;
      }

      if (isReduxTravelling) {
        isReduxTravelling = false;
        // notify registered callback travelling
        const routerState = selectRouterState(store.getState());
        registeredCallback.forEach(c => callListener(c, routerState.location, routerState.action));
        return;
      }
      batch(() => {
        store.dispatch(locationChangeAction(location, action));
        const routerState = selectRouterState(store.getState());
        registeredCallback.forEach(c => callListener(c, routerState.location, routerState.action));
      });
    });

    // listen to reach globalHistory (support "navigate")
    if (reachGlobalHistory) {
      reachGlobalHistory.listen(({ location, action }) => {
        if (action !== `POP`) {
          const loc = {
            pathname: location.pathname,
            search: location.search,
            hash: location.hash,
            key: location.key,
            state: location.state,
          };
          batch(() => {
            store.dispatch(locationChangeAction(loc, action));
            const routerState = selectRouterState(store.getState());
            registeredCallback.forEach(c => callListener(c, routerState.location, routerState.action));
          });
        }
      });
    }

    return {
      listenObject,
      block: history.block,
      createHref: history.createHref,
      push: (...args) => store.dispatch(push(...args)),
      replace: (...args) => store.dispatch(replace(...args)),
      go: (...args) => store.dispatch(go(...args)),
      goBack: (...args) => store.dispatch(goBack(...args)),
      goForward: (...args) => store.dispatch(goForward(...args)),
      listen: callback => {
        if (registeredCallback.indexOf(callback) < 0) {
          registeredCallback.push(callback);
        }
        return () => {
          registeredCallback = registeredCallback.filter(c => c !== callback);
        };
      },
      get location() {
        return selectRouterState(store.getState()).location;
      },
      get action() {
        return selectRouterState(store.getState()).action;
      },
      get length() {
        return history.length;
      },
    };
  };

  return { routerReducer, routerMiddleware, createReduxHistory };
};

import { LOCATION_CHANGE, go, goBack, goForward, push, replace } from './actions';
import { createRouterMiddleware } from './middleware';
import { createRouterReducer } from './reducer';

export const createReduxHistoryContext = ({
  history,
  routerReducerKey = 'router',
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
    payload: { location, action },
  });

  const routerReducer = createRouterReducer({ savePreviousLocations });
  const routerMiddleware = createRouterMiddleware({ history, showHistoryAction });

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

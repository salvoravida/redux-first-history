'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var CALL_HISTORY_METHOD = '@@router/CALL_HISTORY_METHOD';
var LOCATION_CHANGE = '@@router/LOCATION_CHANGE';

var updateLocation = function updateLocation(method) {
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return {
      type: CALL_HISTORY_METHOD,
      payload: {
        method: method,
        args: args
      }
    };
  };
};

var push = updateLocation('push');
var replace = updateLocation('replace');
var go = updateLocation('go');
var goBack = updateLocation('goBack');
var goForward = updateLocation('goForward');

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var createRouterMiddleware = function createRouterMiddleware(_ref) {
  var history = _ref.history,
      showHistoryAction = _ref.showHistoryAction;
  return function () {
    return function (next) {
      return function (action) {
        if (action.type !== CALL_HISTORY_METHOD) {
          return next(action);
        }

        var _action$payload = action.payload,
            method = _action$payload.method,
            args = _action$payload.args;
        history[method].apply(history, _toConsumableArray(args));
        if (showHistoryAction) return next(action);
      };
    };
  };
};

var createRouterReducer = function createRouterReducer(_ref) {
  var _ref$savePreviousLoca = _ref.savePreviousLocations,
      savePreviousLocations = _ref$savePreviousLoca === void 0 ? 0 : _ref$savePreviousLoca;
  var initialState = {
    location: null,
    action: null
  }; // eslint-disable-next-line no-restricted-globals

  var numLocationToTrack = isNaN(savePreviousLocations) ? 0 : savePreviousLocations;
  if (numLocationToTrack) initialState.previousLocations = [];
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;

    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        type = _ref2.type,
        payload = _ref2.payload;

    if (type === LOCATION_CHANGE) {
      var _ref3 = payload || {},
          location = _ref3.location,
          action = _ref3.action;

      var previousLocations = numLocationToTrack ? [{
        location: location,
        action: action
      }].concat(_toConsumableArray(state.previousLocations.slice(0, numLocationToTrack))) : undefined;
      return _objectSpread2({}, state, {
        location: location,
        action: action,
        previousLocations: previousLocations
      });
    }

    return state;
  };
};

var createReduxHistoryContext = function createReduxHistoryContext(_ref) {
  var history = _ref.history,
      _ref$routerReducerKey = _ref.routerReducerKey,
      routerReducerKey = _ref$routerReducerKey === void 0 ? 'router' : _ref$routerReducerKey,
      _ref$reduxTravelling = _ref.reduxTravelling,
      reduxTravelling = _ref$reduxTravelling === void 0 ? false : _ref$reduxTravelling,
      _ref$showHistoryActio = _ref.showHistoryAction,
      showHistoryAction = _ref$showHistoryActio === void 0 ? false : _ref$showHistoryActio,
      _ref$selectRouterStat = _ref.selectRouterState,
      selectRouterState = _ref$selectRouterStat === void 0 ? null : _ref$selectRouterStat,
      _ref$savePreviousLoca = _ref.savePreviousLocations,
      savePreviousLocations = _ref$savePreviousLoca === void 0 ? 0 : _ref$savePreviousLoca,
      _ref$batch = _ref.batch,
      batch = _ref$batch === void 0 ? null : _ref$batch,
      _ref$reachGlobalHisto = _ref.reachGlobalHistory,
      reachGlobalHistory = _ref$reachGlobalHisto === void 0 ? null : _ref$reachGlobalHisto,
      _ref$listenObject = _ref.listenObject,
      listenObject = _ref$listenObject === void 0 ? false : _ref$listenObject;

  var callListener = function callListener(listener, location, action) {
    return listenObject ? listener({
      location: location,
      action: action
    }) : listener(location, action);
  };

  if (typeof batch !== 'function') {
    batch = function batch(fn) {
      fn();
    };
  }
  /** ********************************************  REDUX REDUCER ***************************************************** */


  if (typeof selectRouterState !== 'function') {
    selectRouterState = function selectRouterState(state) {
      return state[routerReducerKey];
    };
  }

  var locationChangeAction = function locationChangeAction(location, action) {
    return {
      type: LOCATION_CHANGE,
      payload: {
        location: location,
        action: action
      }
    };
  };

  var routerReducer = createRouterReducer({
    savePreviousLocations: savePreviousLocations
  });
  var routerMiddleware = createRouterMiddleware({
    history: history,
    showHistoryAction: showHistoryAction
  });
  /** ******************************************  REDUX TRAVELLING  ************************************************** */

  var isReduxTravelling = false;

  var handleReduxTravelling = function handleReduxTravelling(store) {
    var locationEqual = function locationEqual(loc1, loc2) {
      return loc1.pathname === loc2.pathname && loc1.search === loc2.search && loc1.hash === loc2.hash;
    };

    return store.subscribe(function () {
      var sLoc = selectRouterState(store.getState()).location;
      var hLoc = history.location;

      if (sLoc && hLoc && !locationEqual(sLoc, hLoc)) {
        isReduxTravelling = true;
        history.push({
          pathname: sLoc.pathname,
          search: sLoc.search,
          hash: sLoc.hash
        });
      }
    });
  };
  /** ******************************************  REDUX FIRST HISTORY   *********************************************** */


  var createReduxHistory = function createReduxHistory(store) {
    if (reduxTravelling) {
      handleReduxTravelling(store);
    }

    var registeredCallback = []; // init location store

    store.dispatch(locationChangeAction(history.location, history.action)); // listen to history API

    history.listen(function (location, action) {
      // support history v5
      if (location.location) {
        action = location.action;
        location = location.location;
      }

      if (isReduxTravelling) {
        isReduxTravelling = false; // notify registered callback travelling

        var routerState = selectRouterState(store.getState());
        registeredCallback.forEach(function (c) {
          return callListener(c, routerState.location, routerState.action);
        });
        return;
      }

      batch(function () {
        store.dispatch(locationChangeAction(location, action));
        var routerState = selectRouterState(store.getState());
        registeredCallback.forEach(function (c) {
          return callListener(c, routerState.location, routerState.action);
        });
      });
    }); // listen to reach globalHistory (support "navigate")

    if (reachGlobalHistory) {
      reachGlobalHistory.listen(function (_ref2) {
        var location = _ref2.location,
            action = _ref2.action;

        if (action !== "POP") {
          var loc = {
            pathname: location.pathname,
            search: location.search,
            hash: location.hash,
            key: location.key,
            state: location.state
          };
          batch(function () {
            store.dispatch(locationChangeAction(loc, action));
            var routerState = selectRouterState(store.getState());
            registeredCallback.forEach(function (c) {
              return callListener(c, routerState.location, routerState.action);
            });
          });
        }
      });
    }

    return {
      listenObject: listenObject,
      block: history.block,
      createHref: history.createHref,
      push: function push$1() {
        return store.dispatch(push.apply(void 0, arguments));
      },
      replace: function replace$1() {
        return store.dispatch(replace.apply(void 0, arguments));
      },
      go: function go$1() {
        return store.dispatch(go.apply(void 0, arguments));
      },
      goBack: function goBack$1() {
        return store.dispatch(goBack.apply(void 0, arguments));
      },
      goForward: function goForward$1() {
        return store.dispatch(goForward.apply(void 0, arguments));
      },
      listen: function listen(callback) {
        if (registeredCallback.indexOf(callback) < 0) {
          registeredCallback.push(callback);
        }

        return function () {
          registeredCallback = registeredCallback.filter(function (c) {
            return c !== callback;
          });
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
      }

    };
  };

  return {
    routerReducer: routerReducer,
    routerMiddleware: routerMiddleware,
    createReduxHistory: createReduxHistory
  };
};

var reachify = function reachify(reduxHistory) {
  var transitioning = false;

  var resolveTransition = function resolveTransition() {};

  return {
    // eslint-disable-next-line no-underscore-dangle
    _onTransitionComplete: function _onTransitionComplete() {
      transitioning = false;
      resolveTransition();
    },
    listen: function listen(listener) {
      if (reduxHistory.listenObject) {
        return reduxHistory.listen(listener);
      }

      return reduxHistory.listen(function (location, action) {
        return listener({
          location: location,
          action: action
        });
      });
    },
    navigate: function navigate(to) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          state = _ref.state,
          _ref$replace = _ref.replace,
          replace = _ref$replace === void 0 ? false : _ref$replace;

      if (transitioning || replace) {
        reduxHistory.replace(to, state);
      } else {
        reduxHistory.push(to, state);
      }

      transitioning = true;
      return new Promise(function (res) {
        return resolveTransition = res;
      });
    },

    get location() {
      return reduxHistory.location;
    },

    get transitioning() {
      return transitioning;
    }

  };
};

exports.CALL_HISTORY_METHOD = CALL_HISTORY_METHOD;
exports.LOCATION_CHANGE = LOCATION_CHANGE;
exports.createReduxHistoryContext = createReduxHistoryContext;
exports.go = go;
exports.goBack = goBack;
exports.goForward = goForward;
exports.push = push;
exports.reachify = reachify;
exports.replace = replace;

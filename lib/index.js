'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
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

/*************************************************  reachify     ******************************************************/
var reachify = function reachify(reduxHistory) {
  var transitioning = false;

  var resolveTransition = function resolveTransition() {};

  var rrHistory = {
    // eslint-disable-next-line no-underscore-dangle
    _onTransitionComplete: function _onTransitionComplete() {
      transitioning = false;
      resolveTransition();
    },
    listen: function listen(listener) {
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
    }
  };
  Object.defineProperty(rrHistory, 'location', {
    get: function get() {
      return reduxHistory.location;
    }
  });
  Object.defineProperty(rrHistory, 'transitioning', {
    get: function get() {
      return transitioning;
    }
  });
  return rrHistory;
};
/*************************************************  REDUX ACTIONS *****************************************************/

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

var _push = updateLocation('push');

var _replace = updateLocation('replace');

var _go = updateLocation('go');

var _goBack = updateLocation('goBack');

var _goForward = updateLocation('goForward');
var createReduxHistoryContext = function createReduxHistoryContext(_ref2) {
  var history = _ref2.history,
      _ref2$routerReducerKe = _ref2.routerReducerKey,
      routerReducerKey = _ref2$routerReducerKe === void 0 ? 'router' : _ref2$routerReducerKe,
      _ref2$oldLocationChan = _ref2.oldLocationChangePayload,
      oldLocationChangePayload = _ref2$oldLocationChan === void 0 ? false : _ref2$oldLocationChan,
      _ref2$reduxTravelling = _ref2.reduxTravelling,
      reduxTravelling = _ref2$reduxTravelling === void 0 ? false : _ref2$reduxTravelling,
      _ref2$showHistoryActi = _ref2.showHistoryAction,
      showHistoryAction = _ref2$showHistoryActi === void 0 ? false : _ref2$showHistoryActi,
      _ref2$selectRouterSta = _ref2.selectRouterState,
      selectRouterState = _ref2$selectRouterSta === void 0 ? null : _ref2$selectRouterSta,
      _ref2$savePreviousLoc = _ref2.savePreviousLocations,
      savePreviousLocations = _ref2$savePreviousLoc === void 0 ? 0 : _ref2$savePreviousLoc,
      _ref2$batch = _ref2.batch,
      batch = _ref2$batch === void 0 ? null : _ref2$batch;

  /**********************************************  REDUX REDUCER ******************************************************/
  if (typeof batch !== 'function') {
    batch = function batch(fn) {
      fn();
    };
  }

  if (typeof selectRouterState !== 'function') {
    selectRouterState = function selectRouterState(state) {
      return state[routerReducerKey];
    };
  }

  var locationChangeAction = function locationChangeAction(location, action) {
    return {
      type: LOCATION_CHANGE,
      payload: oldLocationChangePayload ? _objectSpread2({}, location, {
        action: action
      }) : {
        location: location,
        action: action
      }
    };
  };

  var initialState = {
    location: null,
    action: null
  };
  var numLocationToTrack = isNaN(savePreviousLocations) ? 0 : savePreviousLocations;
  if (numLocationToTrack) initialState.previousLocations = [];

  var routerReducer = function routerReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;

    var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        type = _ref3.type,
        payload = _ref3.payload;

    if (type === LOCATION_CHANGE) {
      if (oldLocationChangePayload) {
        var _ref4 = payload || {},
            _action = _ref4.action,
            _location = _objectWithoutProperties(_ref4, ["action"]);

        var _previousLocations = numLocationToTrack ? [{
          location: _location,
          action: _action
        }].concat(_toConsumableArray(state.previousLocations.slice(0, numLocationToTrack))) : undefined;

        return _objectSpread2({}, state, {
          location: _location,
          action: _action,
          previousLocations: _previousLocations
        });
      }

      var _ref5 = payload || {},
          location = _ref5.location,
          action = _ref5.action;

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
  /***********************************************  REDUX MIDDLEWARE **************************************************/
  // eslint-disable-next-line


  var routerMiddleware = function routerMiddleware() {
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
  /********************************************  REDUX TRAVELLING  ***************************************************/


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
  /********************************************  REDUX FIRST HISTORY   ************************************************/


  var createReduxHistory = function createReduxHistory(store) {
    if (reduxTravelling) {
      handleReduxTravelling(store);
    }

    var registeredCallback = []; //init location store

    store.dispatch(locationChangeAction(history.location, history.action)); //listen to history API

    history.listen(function (location, action) {
      if (isReduxTravelling) {
        isReduxTravelling = false; //notify registered callback travelling

        var routerState = selectRouterState(store.getState());
        registeredCallback.forEach(function (c) {
          return c(routerState.location, routerState.action);
        });
        return;
      }

      batch(function () {
        store.dispatch(locationChangeAction(location, action));
        var routerState = selectRouterState(store.getState());
        registeredCallback.forEach(function (c) {
          return c(routerState.location, routerState.action);
        });
      });
    });
    var reduxFirstHistory = {
      block: history.block,
      createHref: history.createHref,
      push: function push() {
        return store.dispatch(_push.apply(void 0, arguments));
      },
      replace: function replace() {
        return store.dispatch(_replace.apply(void 0, arguments));
      },
      go: function go() {
        return store.dispatch(_go.apply(void 0, arguments));
      },
      goBack: function goBack() {
        return store.dispatch(_goBack.apply(void 0, arguments));
      },
      goForward: function goForward() {
        return store.dispatch(_goForward.apply(void 0, arguments));
      },
      //listen tunnel
      listen: function listen(callback) {
        if (registeredCallback.indexOf(callback) < 0) {
          registeredCallback.push(callback);
        }

        return function () {
          registeredCallback = registeredCallback.filter(function (c) {
            return c !== callback;
          });
        };
      }
    }; //location tunnel

    Object.defineProperty(reduxFirstHistory, 'location', {
      get: function get() {
        return selectRouterState(store.getState()).location;
      }
    }); //action tunnel

    Object.defineProperty(reduxFirstHistory, 'action', {
      get: function get() {
        return selectRouterState(store.getState()).action;
      }
    }); //length tunnel

    Object.defineProperty(reduxFirstHistory, 'length', {
      get: function get() {
        return history.length;
      }
    });
    return reduxFirstHistory;
  };

  return {
    routerReducer: routerReducer,
    routerMiddleware: routerMiddleware,
    createReduxHistory: createReduxHistory
  };
};

exports.CALL_HISTORY_METHOD = CALL_HISTORY_METHOD;
exports.LOCATION_CHANGE = LOCATION_CHANGE;
exports.createReduxHistoryContext = createReduxHistoryContext;
exports.go = _go;
exports.goBack = _goBack;
exports.goForward = _goForward;
exports.push = _push;
exports.reachify = reachify;
exports.replace = _replace;

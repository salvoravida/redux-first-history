'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/*************************************************  reachify     ******************************************************/

var reachify = exports.reachify = function reachify(reduxHistory) {
  var transitioning = false;
  var resolveTransition = function resolveTransition() {};

  var rrHistory = {
    _onTransitionComplete: function _onTransitionComplete() {
      transitioning = false;
      resolveTransition();
    },
    listen: function listen(listener) {
      return reduxHistory.listen(function (location, action) {
        return listener({ location: location, action: action });
      });
    },
    navigate: function navigate(to) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          state = _ref.state,
          _ref$replace = _ref.replace,
          replace = _ref$replace === undefined ? false : _ref$replace;

      if (transitioning || replace) {
        reduxHistory.replace({ pathname: to, state: state, key: '' + Date.now() });
      } else {
        reduxHistory.push({ pathname: to, state: state, key: '' + Date.now() });
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

var CALL_HISTORY_METHOD = exports.CALL_HISTORY_METHOD = '@@router/CALL_HISTORY_METHOD';
var LOCATION_CHANGE = exports.LOCATION_CHANGE = '@@router/LOCATION_CHANGE';

var updateLocation = function updateLocation(method) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return {
      type: CALL_HISTORY_METHOD,
      payload: { method: method, args: args }
    };
  };
};

var _push = updateLocation('push');
exports.push = _push;
var _replace = updateLocation('replace');
exports.replace = _replace;
var _go = updateLocation('go');
exports.go = _go;
var _goBack = updateLocation('goBack');
exports.goBack = _goBack;
var _goForward = updateLocation('goForward');

/*************************************************  CONTEXT  **********************************************************/

exports.goForward = _goForward;
var createReduxHistoryContext = function createReduxHistoryContext(_ref2) {
  var history = _ref2.history,
      _ref2$routerReducerKe = _ref2.routerReducerKey,
      routerReducerKey = _ref2$routerReducerKe === undefined ? 'router' : _ref2$routerReducerKe,
      _ref2$oldLocationChan = _ref2.oldLocationChangePayload,
      oldLocationChangePayload = _ref2$oldLocationChan === undefined ? false : _ref2$oldLocationChan,
      _ref2$reduxTravelling = _ref2.reduxTravelling,
      reduxTravelling = _ref2$reduxTravelling === undefined ? false : _ref2$reduxTravelling,
      _ref2$showHistoryActi = _ref2.showHistoryAction,
      showHistoryAction = _ref2$showHistoryActi === undefined ? false : _ref2$showHistoryActi;

  /**********************************************  REDUX REDUCER ******************************************************/

  var locationChangeAction = function locationChangeAction(location, action) {
    return {
      type: LOCATION_CHANGE,
      payload: oldLocationChangePayload ? Object.assign({}, location, { action: action }) : { location: location, action: action }
    };
  };

  var initialState = {
    location: null,
    action: null
  };

  var routerReducer = function routerReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;

    var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        type = _ref3.type,
        payload = _ref3.payload;

    if (type === LOCATION_CHANGE) {
      if (oldLocationChangePayload) {
        var _ref4 = payload || {},
            _action = _ref4.action,
            _location = _objectWithoutProperties(_ref4, ['action']);

        return Object.assign({}, state, { location: _location, action: _action });
      }

      var _ref5 = payload || {},
          location = _ref5.location,
          action = _ref5.action;

      return Object.assign({}, state, { location: location, action: action });
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
      var sLoc = store.getState()[routerReducerKey].location;
      var hLoc = history.location;
      if (sLoc && hLoc && !locationEqual(sLoc, hLoc)) {
        isReduxTravelling = true;
        history.push({ pathname: sLoc.pathname, search: sLoc.search, hash: sLoc.hash });
      }
    });
  };

  /********************************************  REDUX FIRST HISTORY   ************************************************/

  var createReduxHistory = function createReduxHistory(store) {
    if (reduxTravelling) {
      handleReduxTravelling(store, history);
    }

    var registeredCallback = [];

    //init location store
    store.dispatch(locationChangeAction(history.location, history.action));

    //listen to history API
    history.listen(function (location, action) {
      if (isReduxTravelling) {
        isReduxTravelling = false;
        //notify registered callback travelling
        var _state = store.getState();
        registeredCallback.forEach(function (c) {
          return c(_state[routerReducerKey].location, _state[routerReducerKey].action);
        });
        return;
      }
      store.dispatch(locationChangeAction(location, action));
      var state = store.getState();
      registeredCallback.forEach(function (c) {
        return c(state[routerReducerKey].location, state[routerReducerKey].action);
      });
    });

    var reduxFirstHistory = {
      createHref: history.createHref,
      push: function push() {
        return store.dispatch(_push.apply(undefined, arguments));
      },
      replace: function replace() {
        return store.dispatch(_replace.apply(undefined, arguments));
      },
      go: function go() {
        return store.dispatch(_go.apply(undefined, arguments));
      },
      goBack: function goBack() {
        return store.dispatch(_goBack.apply(undefined, arguments));
      },
      goForward: function goForward() {
        return store.dispatch(_goForward.apply(undefined, arguments));
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
    };

    //location tunnel
    Object.defineProperty(reduxFirstHistory, 'location', {
      get: function get() {
        return store.getState()[routerReducerKey].location;
      }
    });

    //action tunnel
    Object.defineProperty(reduxFirstHistory, 'action', {
      get: function get() {
        return store.getState()[routerReducerKey].action;
      }
    });

    //length tunnel
    Object.defineProperty(reduxFirstHistory, 'length', {
      get: function get() {
        return history.length;
      }
    });

    return reduxFirstHistory;
  };

  return { routerReducer: routerReducer, routerMiddleware: routerMiddleware, createReduxHistory: createReduxHistory };
};
exports.createReduxHistoryContext = createReduxHistoryContext;
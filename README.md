# redux-first-history
<p align="center">
  <a href="https://www.npmjs.com/package/redux-first-history"><img src="https://img.shields.io/npm/v/redux-first-history.svg?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/redux-first-history"><img src="https://img.shields.io/npm/dt/redux-first-history.svg?style=flat-square"></a>
  <img src="./cov-badge.svg"></a><br/>
  Redux First History - Make Redux 100% SINGLE-AND-ONLY source of truth!
</p>

Redux history binding for
* [`react-router`](https://github.com/remix-run/react-router)
* [`@reach/router`](https://github.com/reach/router)
* [`wouter`](https://github.com/molefrog/wouter)
* [`react-location`](https://github.com/tanstack/react-location)
* Mix `react-router` - `@reach/router` - `wouter` - `react-location` in the same app! See [Demo](#demo).

Compatible with `immer` - `redux-immer` - `redux-immutable`.

:tada: A smaller, faster, optionated, issue-free alternative to 
[`connected-react-router`](https://github.com/supasate/connected-react-router/issues)

## Table of Contents

- [Main Goal](#main-goal)
  - [Demo](#demo)
- [Main Features](#main-features)
- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [Advanced Config](#advanced-config)
- [Feedback](#feedback)
- [Credits & Inspiration](#credits--inspiration)
- [Contributors](#contributors)
- [License](#license)


## Main Goal
While working with *relatively large* projects, it's quite common to use both `redux` and `react-router`.

So you may have components that take location from the redux store, others that take location from router context, and others from withRouter HOC.

This can generate sync issues, due to the fact that many components are updated at different times.
In addition, React shallowCompare rendering optimization will not work as it should.

With `redux-first-history`, you can mix components that get history from wherever, 
they will always be tunneled to *state.router.location* !

*Use whatever you like. History will just work as it should.*

```javascript
//react-router v5 - v6
useLocation() === state.router.location

//react-router v5
this.props.history.location === state.router.location
this.props.location === state.router.location
withRouter.props.location === state.router.location

//react-router v4
this.context.router.history.location === state.router.location
this.context.route.location === state.router.location

//@reach/router
this.props.location === state.router.location

//wouter - pathname
useLocation()[0] === state.router.location.pathname
```

Mix redux, redux-saga, react-router, @reach/router, wouter and react-location
without any synchronization issue! <br>
Why? Because there is no synchronization at all! There is only one history: reduxHistory!
* One way data-flow
* One unique source of truth
* No more location issues!

<p align="center">
<img alt="Edit Redux-First Router Demo" src="https://i.postimg.cc/HnxxYzmz/Untitled_Diagram.png">
</p>

## Demo

- react-router v6: https://wvst19.csb.app/ 
  - Source: https://codesandbox.io/s/redux-first-history-demo-rr6-forked-wvst19

- react-router v5: https://wy5qw1125l.codesandbox.io/ 
  - Source: https://codesandbox.io/s/wy5qw1125l

# Main Features
 
* 100% one source of truth (store)
* No synchronization depending on rendering lifecycle (ConnectedRouter)
* No React dependency (we want history to be always in store!)
* 100% one-way data flow (only dispatch actions!)
* Improve React shallowCompare as there is only one "location"
* Support react-location 3.x
* Support react-router v4 / v5 / v6
* Support @reach/router 1.x
* Support wouter 2.x
* Support mix react-router, @reach/router & wouter in the same app!
* Fast migration from an existing project, with the same `LOCATION_CHANGE` and push actions (taken from RRR)
* Handle Redux Travelling from dev tools (that's nonsense in production, but at the end of the day this decision it's up to you ...)


## Installation
Using [npm](https://www.npmjs.com/):

    $ npm install --save redux-first-history

Or [yarn](https://yarnpkg.com/):

    $ yarn add redux-first-history

## Usage

store.js

```javascript
import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createReduxHistoryContext, reachify } from "redux-first-history";
import { createWouterHook } from "redux-first-history/wouter";
import { createBrowserHistory } from 'history';

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({ 
  history: createBrowserHistory(),
  //other options if needed 
});

export const store = createStore(
  combineReducers({
    router: routerReducer
    //... reducers //your reducers!
  }),
  composeWithDevTools(
    applyMiddleware(routerMiddleware)
  )
);

export const history = createReduxHistory(store);
//if you use @reach/router 
export const reachHistory = reachify(history);
//if you use wouter
export const wouterUseLocation = createWouterHook(history);
```

store.js (with @reduxjs/toolkit)
```javascript
import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { createReduxHistoryContext } from "redux-first-history";
import { createBrowserHistory } from "history";

const {
  createReduxHistory,
  routerMiddleware,
  routerReducer
} = createReduxHistoryContext({ history: createBrowserHistory() });

export const store = configureStore({
  reducer: combineReducers({
    router: routerReducer
  }),
  middleware: [routerMiddleware]
});

export const history = createReduxHistory(store);
```

app.js 
```javascript
import React, { Component } from "react";
import { Provider, connect } from "react-redux";
import { Router } from "react-router-dom";
import { store, history } from "./store";

const App = () => (
      <Provider store={store}>
        <Router history={history}>
        //.....
        </Router>
      </Provider>
    );

export default App;
```

app.js (react-router v6)
```javascript
import React, { Component } from "react";
import { Provider } from "react-redux";
import { HistoryRouter as Router } from "redux-first-history/rr6";
import { store, history } from "./store";

const App = () => (
      <Provider store={store}>
        <Router history={history}>
        //.....
        </Router>
      </Provider>
    );

export default App;
```


saga.js (react-saga)
```javascript
import { put } from "redux-saga/effects";
import { push } from "redux-first-history";

function* randomFunction() {
  //....
  yield put(push(YOUR_ROUTE_PATH));
  //....
}
```

slice.js (in a Thunk with @reduxjs/toolkit)
```javascript
import { push } from "redux-first-history";

export const RandomThunk = (dispatch) => {
  //....
  dispatch(push(YOUR_ROUTE_PATH));
  //....
}
```


* Just a simple Router with no more ConnectedRouter!
* Probably, you already did connect the Redux store with `react-router-redux` or `connected-react-router` (in this case you have only to replace the import!)


# Options

```javascript 1.8
export const createReduxHistoryContext = ({
  history, 
  routerReducerKey = 'router', 
  reduxTravelling = false, 
  selectRouterState = null,
  savePreviousLocations = 0,
  batch = null,
  reachGlobalHistory = null
})
```

|key	| optional |description   	| 
|---	|---|---	|
|history	| no| The `createBrowserHistory` object - v4.x/v5.x  	| 
|routerReducerKey | yes | if you don't like `router` name for reducer.
|reduxTravelling | yes | if you want to play with redux-dev-tools :D.
|selectRouterState |yes | custom selector for router state. With redux-immutable selectRouterState = state => state.get("router") 
|savePreviousLocations |yes | if > 0 add the key "previousLocation" to state.router, with the last N locations. [{location,action}, ...]
|batch |yes | a batch function for batching states updates with history updates. Prevent top-down updates on react : usage `import { unstable_batchedUpdates } from 'react-dom'; `  `batch = unstable_batchedUpdates`
|reachGlobalHistory |yes | globalHistory object from  `@reach/router` - support imperatively `navigate` of @reach/router  - `import { navigate } from '@reach/router'`  : usage `import { globalHistory } from '@reach/router'; `  `reachGlobalHistory = globalHistory`
|basename	| no| support basename (history v5 fix)  	| 

# Advanced Config

* Support "navigate" from @reach/router
```javascript
import { createReduxHistoryContext, reachify } from "redux-first-history";
import { createBrowserHistory } from 'history';
import { globalHistory } from '@reach/router';

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({ 
  history: createBrowserHistory(),
  reachGlobalHistory: globalHistory,
  //other options if needed 
});
```

* React batch updates: top-down batch updates for maximum performance. Fix also some updated edge cases.
```javascript
import { createReduxHistoryContext, reachify } from "redux-first-history";
import { createBrowserHistory } from 'history';
import { unstable_batchedUpdates } from 'react-dom';

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({ 
  history: createBrowserHistory(),
  batch: unstable_batchedUpdates,
  //other options if needed 
});
```
# Feedback

Let me know what do you think! <br>
*Enjoy it? Star this project!* :D

# Credits & Inspiration
 - redux-first-routing
 - react-router-redux
 - connected-react-router

# Contributors
See [Contributors](https://github.com/salvoravida/redux-first-history/graphs/contributors).

# License
[MIT License](https://github.com/salvoravida/redux-first-history/blob/master/LICENSE.md).

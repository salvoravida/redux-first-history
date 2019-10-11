# redux-first-history
<p align="center">
  <a href="https://www.npmjs.com/package/redux-first-history"><img src="https://img.shields.io/npm/v/redux-first-history.svg?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/redux-first-history"><img src="https://img.shields.io/npm/dm/redux-first-history.svg?style=flat-square"></a><br/>
  Redux First History - Make Redux 100% SINGLE-AND-ONLY source of truth!
</p>

Redux history binding for
* [`react-router`](https://github.com/ReactTraining/react-router)
* [`@reach/router`](https://github.com/reach/router)
* [`wouter`](https://github.com/molefrog/wouter)
* mix `react-router` - `@reach-router` - `wouter` in the same app!! Demo : https://wy5qw1125l.codesandbox.io/.

Compatible with `immer` - `redux-immer` - `redux-immutable`.

:tada: A smaller, faster, optionated, issue-free alternative to 
[`connected-react-router`](https://github.com/supasate/connected-react-router/issues)

## Main Goal
*Use whatever you like. History will just work as it should.*

```javascript
//react-router v4 - v5
this.context.router.history.location === state.router.location
this.context.route.location === state.router.location
this.props.history.location === state.router.location
this.props.location === state.router.location
withRouter.props.location === state.router.location

//@reach/router
this.props.location === state.router.location

//wouter - pathname
useLocation()[0] === state.router.location.pathname
```

You can mix redux, redux-saga, react-router, @reach/router & wouter
without any synchronization issue! <br>
Why? Because there is no synchronization at all! There is only one history: reduxHistory!
* one way data-flow
* one unique source of truth
* no more location issue!

<p align="center">
<img alt="Edit Redux-First Router Demo" src="https://i.postimg.cc/HnxxYzmz/Untitled_Diagram.png">
</p>

Demo : https://wy5qw1125l.codesandbox.io/ src: https://codesandbox.io/s/wy5qw1125l

# Main features
 
* 100% one source of truth (store)
* No syncronization depending on rendering lifecicle (ConnectedRouter)
* No React dependency (we want history to be always in store!)
* 100% one-way data flow (only dispatch actions!)
* improve React shallowCompare as there is only one "location"
* support react-router v4 and v5
* support @reach/router 1.2.1
* support @wouter 2.x
* support mix react-router, @reach-router & wouter in the same app!
* fast migration from existing project, with same `LOCATION_CHANGE` and push actions (taken from RRR)
* handle Redux Travelling from devTools (that's a non sense in production, but at the end of the day this decision it's up to you ...) 
* custom opions and blazing fast  (ok, every lib should have these features, that's true :D)

Installation
-----------
Using [npm](https://www.npmjs.com/):

    $ npm install --save redux-first-history

Or [yarn](https://yarnpkg.com/):

    $ yarn add redux-first-history
Usage
-----

store.js

```javascript
import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createReduxHistoryContext, reachify } from "redux-first-history";
import { createWouterHook } from "redux-first-history/wouter";
import createHistory from "history/createBrowserHistory";

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({ 
  history: createHistory(),
  //others options if needed 
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

app.js 
```javascript
import React, { Component } from "react";
import { Provider, connect } from "react-redux";
import { push } from "redux-first-history";
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
* just simple Router with no more ConnectedRouter!
* use `push` action creator from `redux-first-history` if you need to dispatch location from `saga` or connected components.
* Probably, you already did it with `react-router-redux` or `connected-react-router` (in this case you have only to replace the import!) 

# Abstract

While working with *relatively large* projects, it's quite common to use both `redux` and `react-router`.

So you may have components that take location from store, others that take location from router context, and others from withRouter HOC. If you are on a big crazy already-messed-up project, you could see also connect(withRouter) or withRouter(connect) ....

This sometimes could generate sync issue, due to the fact that many components are updated at different time.
In addition, React shallowCompare rendering optimization will not work as it should.

With `redux-first-history`, you can mix components that get history from wherever, 
they will always be tunneled to *state.router.location* !

# Options

```javascript 1.8
export const createReduxHistoryContext = ({
  history, 
  routerReducerKey = 'router', 
  oldLocationChangePayload = false, 
  reduxTravelling = false, 
  selectRouterState = null
})
```

|key	| optional |description   	| 
|---	|---|---	|
|history	| no| The `history/createBrowserHistory` object - currently tested only with version 4.7.2 and 4.9.0  	| 
|routerReducerKey | yes | if you don't like `router` name for reducer.
|oldLocationChangePayload | yes | if you use the old`LOCATION_CHANGE`payload`{ ...location }`instead of the new`{ location }`, setting this flag will make you able to not change your app at all!
|reduxTravelling | yes | if you want to play with redux-dev-tools :D.
|selectRouterState |yes | custom selector for router state. With redux-immutable selectRouterState = state => state.get("router") 

# Feedback

Let me know what do you think! <br>
*Enjoy it? Star this project!* :D

# Todo
* test, test and test!
* code clean and split
* a better way to compile with rollup
* warning for uncorrect usage
* try to use it with non-react-like other framework!
* redux-first-app POC

any idea? let me know and contribute!

# credits & inspiration
 - redux-first-routing
 - react-router-redux
 - connected-react-router

Contributors
------------
See [Contributors](https://github.com/salvoravida/redux-first-history/graphs/contributors).

License
-------
[MIT License](https://github.com/salvoravida/redux-first-history/blob/master/LICENSE.md).

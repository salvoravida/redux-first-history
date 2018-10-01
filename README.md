# redux-first-history [![npm version](https://img.shields.io/npm/v/redux-first-history.svg?style=flat)](https://www.npmjs.org/package/redux-first-history) 

Redux First History - Make Redux 100% SINGLE-AND-ONLY source of truth again!

## Main Goal
*Use whatever you like. History will just work as it must.*

```javascript
//react-router v4
this.context.router.history.location === state.router.location
this.context.route.location === state.router.location
this.props.history.location === state.router.location
this.props.location === state.router.location
withRouter.props.location === state.router.location

//@reach/router
this.props.location === state.router.location
```

You can mix redux, redux-saga, react-router & @reach/router 
without any synchronization issue! <br>
Why? Because there is no synchronization! There is only one history: reduxHistory!
* one way data-flow
* one source of truth
* no more location issue!

Demo : https://wy5qw1125l.codesandbox.io/ src: https://codesandbox.io/s/wy5qw1125l


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
import createHistory from "history/createBrowserHistory";

const {  createReduxHistory,  routerMiddleware, routerReducer} = createReduxHistoryContext({ 
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
```

app.js 
```javascript
import React, { Component } from "react";
import { Provider, connect } from "react-redux";
import { push } from "redux-first-history";
import { Router } from "react-router-dom";
import { store, history } from "./store";

const App=() => (
      <Provider store={store}>
        <Router history={history}>
        //.....
        </Router>
      </Provider>
    );

export default App;
```
* just simple Route no more ConnectedRouter!
* use push action if you need dispatching history from saga or connected components.

# Abstract

It's quite common to use in relative big projects
redux store and react-router declarative routing.

So you may have components that take location from store,
others that take location from router context, and others from withRouter HOC.
If you are on a crazy project, you could see also connect(withRouter) or
withRouter(connect) ....

This sometimes could generate sync issue, when many
components are updated at different time,
and also React shallowCompare optimization will not work as could.

with Redux First History, you can mix components that get history from whatever, 
it will always be tunneled to *state.router.location*!

# Main features
 
* 100% one source of truth (store)
* No syncronization depending on rendering lifecicle (ConnectedRouter)
* No React dependance (we want history in store always!)
* 100% one-way data flow (only dispatch actions!)
* improve React shallowCompare as there is only one "location"
* support react-router v4
* support @reach/router 1.2.1
* support mix react-router & @reach-router in the same app.
* fast migration existing project, with same LOCATION_CHANGE and push actions (taken from RRR)
* handle Redux Travelling from devTools (that's non sense in production, but if you need ...) 
* optionated and blazing fast  (ok every lib must have these features :D)

# Options

```javascript 1.8
export const createReduxHistoryContext = ({
  history, routerReducerKey = 'router', oldLocationChangePayload = false, reduxTravelling = false, 
})
```

|key	| optional |description   	| 
|---	|---|---	|
|history	| no| "history/createBrowserHistory" object - currently tested only with version 4.7.2  	| 
|routerReducerKey | yes | if you do not like "router" name for reducer.
|oldLocationChangePayload | yes | if you use old LOCATION_CHANGE payload { ...location } instead of new { location}, by setting this flag you do not have to change your app!.
|reduxTravelling | yes | if you want to play with redux-dev-tools :D.

# Feedback

Let me know what do you think about! <br>
*Enjoy it? Star this project!* :D

# Todo
* test, test and test!
* code clean and split
* best compile with rollup
* warning for uncorrect use
* typescript
* try use with non-react-like other framework!
* redux-first-app poc 

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

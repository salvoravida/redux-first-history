/* eslint-disable prefer-object-spread, import/no-unresolved*/
import React from 'react';
import { Router } from 'react-router';

export function HistoryRouter({ children, history }) {
   const [state, setState] = React.useState({
      action: history.action,
      location: history.location,
   });
   React.useLayoutEffect(() => history.listen(setState), [history]);
   return React.createElement(Router, Object.assign({ children, navigator: history }, state));
}

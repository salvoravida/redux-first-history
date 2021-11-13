/* eslint-disable react/no-children-prop */
import React from 'react';
import { Router } from 'react-router';

export function HistoryRouter({ basename, children, history }) {
   const [state, setState] = React.useState({
      action: history.action,
      location: history.location,
   });
   React.useLayoutEffect(() => history.listen(setState), [history]);
   return React.createElement(Router, {
      basename,
      children,
      location: state.location,
      navigationType: state.action,
      navigator: history,
   });
}
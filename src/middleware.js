import { CALL_HISTORY_METHOD } from './actions';

// eslint-disable-next-line consistent-return
export const createRouterMiddleware = ({ history, showHistoryAction }) => () => next => action => {
  if (action.type !== CALL_HISTORY_METHOD) {
    return next(action);
  }
  const {
    payload: { method, args },
  } = action;
  history[method](...args);
  if (showHistoryAction) return next(action);
};

export const reachify = reduxHistory => {
  let transitioning = false;
  let resolveTransition = () => {};

  return {
    // eslint-disable-next-line no-underscore-dangle
    _onTransitionComplete() {
      transitioning = false;
      resolveTransition();
    },
    listen(listener) {
      if (reduxHistory.listenObject) {
        return reduxHistory.listen(listener);
      }
      return reduxHistory.listen((location, action) => listener({ location, action }));
    },
    navigate(to, { state, replace = false } = {}) {
      if (transitioning || replace) {
        reduxHistory.replace(to, state);
      } else {
        reduxHistory.push(to, state);
      }
      transitioning = true;
      return new Promise(res => (resolveTransition = res));
    },
    get location() {
      return reduxHistory.location;
    },
    get transitioning() {
      return transitioning;
    },
  };
};

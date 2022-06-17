// eslint-disable-next-line import/no-unresolved
import { History } from 'history';
import { ReachHistory } from './reachify.types';

export const reachify = (reduxHistory: History & { listenObject: boolean }): ReachHistory => {
   let transitioning = false;
   // eslint-disable-next-line @typescript-eslint/no-empty-function
   let resolveTransition = () => {};

   return {
      // eslint-disable-next-line no-underscore-dangle
      _onTransitionComplete() {
         transitioning = false;
         resolveTransition();
      },
      listen(listener) {
         if (reduxHistory.listenObject) {
            // @ts-ignore
            return reduxHistory.listen(listener);
         }
         // @ts-ignore
         return reduxHistory.listen((location, action) => listener({ location, action }));
      },
      // @ts-ignore
      navigate(to, { state, replace = false } = {}) {
         if (transitioning || replace) {
            reduxHistory.replace(to, state);
         } else {
            reduxHistory.push(to, state);
         }
         transitioning = true;
         // eslint-disable-next-line no-return-assign
         // @ts-ignore
         return new Promise(res => (resolveTransition = res));
      },
      // @ts-ignore
      get location() {
         return reduxHistory.location;
      },
      get transitioning() {
         return transitioning;
      },
   };
};

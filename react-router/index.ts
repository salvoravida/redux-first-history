import { match, matchPath } from 'react-router';
import { RouterState } from '../src/reducer';

interface Options {
   selectRouterState?: <S>(state: S) => RouterState;
   routerReducerKey?: string;
}

export const createMatchSelector = (path: string, options?: Options) => {
   let lastPathname: string | null = null;
   let lastMatch: match<{}> | null = null;
   let { selectRouterState, routerReducerKey = 'router' } = options ?? {};
   if (typeof selectRouterState !== 'function') {
      selectRouterState = <S>(state: S): RouterState => state[routerReducerKey];
   }
   return <S>(state: S): match<{}> | null => {
      const routerState = selectRouterState!(state);
      const pathname = routerState?.location?.pathname ?? '';
      if (pathname === lastPathname) {
         return lastMatch;
      }
      lastPathname = pathname;
      const match = matchPath(pathname, path);
      if (!match || !lastMatch || (match.url !== lastMatch.url) || (match.isExact !== lastMatch.isExact)) {
         lastMatch = match;
      }
      return lastMatch;
   }
};

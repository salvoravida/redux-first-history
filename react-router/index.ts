import { match, matchPath } from 'react-router';

export const createMatchSelector = (path: string) => {
   let lastPathname: string | null = null;
   let lastMatch: match<{}> | null = null;
   return (state: any) => {
      const { pathname } = state.router.location ?? {};
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

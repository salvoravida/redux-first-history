import { useEffect, useState } from 'react';

export const createWouterHook = history => {
   const navigate = (to, replace) => history[replace ? 'replace' : 'push'](to);

   return () => {
      const [path, update] = useState(history.location.pathname);

      useEffect(
         () => history.listen(l => update(l.location ? l.location.pathname : l.pathname)),
         [],
      );
      return [path, navigate];
   };
};

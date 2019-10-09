import { useEffect, useState } from 'react';

export const createWouterHook = (history) => {
  const navigate = (to, replace) => history[replace ? 'replace' : 'push'](to);

  return () => {
    const [path, update] = useState(history.location.pathname);

    useEffect(() => history.listen((location) => update(location.pathname)), []);
    return [path, navigate];
  };
};

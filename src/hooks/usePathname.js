import { useEffect, useState } from 'react';

export const navigate = (path) => {
  if (window.location.pathname + window.location.hash === path) return;
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'auto' });
};

export function usePathname() {
  const [location, setLocation] = useState(() => ({ pathname: window.location.pathname, hash: window.location.hash }));
  useEffect(() => {
    const update = () => setLocation({ pathname: window.location.pathname, hash: window.location.hash });
    window.addEventListener('popstate', update);
    window.addEventListener('hashchange', update);
    return () => { window.removeEventListener('popstate', update); window.removeEventListener('hashchange', update); };
  }, []);
  return location;
}

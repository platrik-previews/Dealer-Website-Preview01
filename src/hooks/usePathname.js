import { useEffect, useState } from 'react';

const getBasePath = () => globalThis.__PLATRIK_PREVIEW_BASE__ || '';

export const toPublicPath = (path) => {
  if (!path?.startsWith('/')) return path;
  const basePath = getBasePath();
  if (!basePath) return path;
  if (path === '/') return `${basePath}/`;
  return `${basePath}${path}`;
};

const toAppPath = (pathname) => {
  const basePath = getBasePath();
  if (!basePath) return pathname;
  if (pathname === basePath || pathname === `${basePath}/`) return '/';
  if (pathname.startsWith(`${basePath}/`)) return pathname.slice(basePath.length) || '/';
  return pathname;
};

export const navigate = (path) => {
  const publicPath = toPublicPath(path);
  if (window.location.pathname + window.location.hash === publicPath) return;
  window.history.pushState({}, '', publicPath);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'auto' });
};

export function usePathname() {
  const getLocation = () => ({ pathname: toAppPath(window.location.pathname), hash: window.location.hash });
  const [location, setLocation] = useState(getLocation);
  useEffect(() => {
    const update = () => setLocation(getLocation());
    window.addEventListener('popstate', update);
    window.addEventListener('hashchange', update);
    return () => { window.removeEventListener('popstate', update); window.removeEventListener('hashchange', update); };
  }, []);
  return location;
}

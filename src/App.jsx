import { useEffect } from 'react';
import { business } from './config/business';
import { theme } from './config/theme';
import { useAuth } from './hooks/useAuth';
import { usePathname } from './hooks/usePathname';
import { useVehicles } from './hooks/useVehicles';
import { HomePage } from './pages/HomePage';
import { InventoryPage } from './pages/InventoryPage';
import { VehiclePage } from './pages/VehiclePage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

function upsertMeta(key, content, attribute = 'name') {
  if (!content) return;
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

function useSiteConfiguration() {
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      const cssKey = key === 'pageWidth' ? 'page' : key;
      root.style.setProperty(`--${cssKey}`, value);
    });

    root.lang = business.regional.locale.split('-')[0] || 'en';
    document.title = business.seo.title;

    upsertMeta('description', business.seo.description);
    upsertMeta('robots', business.seo.allowIndexing ? 'index, follow' : 'noindex, nofollow, noarchive');
    upsertMeta('og:type', 'website', 'property');
    upsertMeta('og:title', business.seo.title, 'property');
    upsertMeta('og:description', business.seo.description, 'property');
    upsertMeta('og:site_name', business.identity.displayName, 'property');

    if (business.identity.logoImage) {
      upsertMeta('og:image', business.identity.logoImage, 'property');
    }

    upsertLink('icon', business.identity.faviconImage);
  }, []);
}

export default function App() {
  useSiteConfiguration();
  const { pathname, hash } = usePathname();
  const authState = useAuth();
  const vehiclesState = useVehicles();

  useEffect(() => {
    if (hash) window.setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, [pathname, hash]);

  if (pathname === '/login' || pathname === '/dealer-login') return <LoginPage authState={authState} />;
  if (pathname === '/dashboard') return <DashboardPage authState={authState} vehiclesState={vehiclesState} />;
  if (pathname === '/inventory') return <InventoryPage {...vehiclesState} />;
  if (pathname.startsWith('/vehicle/')) {
    const id = decodeURIComponent(pathname.split('/').pop());
    return <VehiclePage vehicle={vehiclesState.vehicles.find((vehicle) => vehicle.id === id)} loading={vehiclesState.loading} />;
  }
  return <HomePage vehicles={vehiclesState.vehicles} loading={vehiclesState.loading} />;
}

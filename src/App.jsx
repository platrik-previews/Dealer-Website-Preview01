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
import {
  AboutPage,
  ContactPage,
  FaqPage,
  FinancePage,
  NotFoundPage,
  PartExchangePage,
  ServicesPage,
} from './pages/MarketingPages';

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

const routeMeta = {
  '/': ['Quality Used Cars', business.seo.description],
  '/inventory': ['Current Stock', `Browse the current vehicle stock available from ${business.identity.displayName}.`],
  '/about': ['About Us', `Learn more about ${business.identity.displayName}, the dealership and its approach to buying and selling vehicles.`],
  '/services': ['Services', `Explore vehicle sourcing, part exchange, finance support and dealership services from ${business.identity.displayName}.`],
  '/finance': ['Finance', `Plan a vehicle budget and contact ${business.identity.displayName} about available finance support or introductions.`],
  '/part-exchange': ['Part Exchange & Sell Your Car', `Share your vehicle details with ${business.identity.displayName} to discuss part exchange or selling your car.`],
  '/contact': ['Contact', `Contact ${business.identity.displayName} about current stock, viewings, part exchange, finance or general enquiries.`],
  '/faq': ['Frequently Asked Questions', `Answers to common questions about vehicles and dealership services at ${business.identity.displayName}.`],
};

function useSiteConfiguration() {
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      const cssKey = key === 'pageWidth' ? 'page' : key;
      root.style.setProperty(`--${cssKey}`, value);
    });

    root.lang = business.regional.locale.split('-')[0] || 'en';

    upsertMeta('robots', business.seo.allowIndexing ? 'index, follow' : 'noindex, nofollow, noarchive');
    upsertMeta('og:type', 'website', 'property');
    upsertMeta('og:site_name', business.identity.displayName, 'property');

    if (business.identity.logoImage) {
      upsertMeta('og:image', business.identity.logoImage, 'property');
    }

    upsertLink('icon', business.identity.faviconImage);
  }, []);
}

function useRouteMeta(pathname) {
  useEffect(() => {
    const basePath = pathname.startsWith('/vehicle/') ? '/inventory' : pathname;
    const [pageTitle, description] = routeMeta[basePath] || ['Page', business.seo.description];
    const title = basePath === '/' ? business.seo.title : `${pageTitle} | ${business.identity.displayName}`;
    document.title = title;
    upsertMeta('description', description);
    upsertMeta('og:title', title, 'property');
    upsertMeta('og:description', description, 'property');
  }, [pathname]);
}

export default function App() {
  useSiteConfiguration();
  const { pathname, hash } = usePathname();
  useRouteMeta(pathname);
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
  if (pathname === '/about') return <AboutPage />;
  if (pathname === '/services') return <ServicesPage />;
  if (pathname === '/finance') return <FinancePage />;
  if (pathname === '/part-exchange' || pathname === '/sell-your-car') return <PartExchangePage />;
  if (pathname === '/contact') return <ContactPage />;
  if (pathname === '/faq') return <FaqPage />;
  if (pathname === '/') return <HomePage vehicles={vehiclesState.vehicles} loading={vehiclesState.loading} />;
  return <NotFoundPage />;
}

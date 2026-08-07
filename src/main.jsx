import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import css01 from './styles/part-01.css?raw';
import css02 from './styles/part-02.css?raw';
import css03 from './styles/part-03.css?raw';
import css04 from './styles/part-04.css?raw';
import css05 from './styles/part-05.css?raw';
import css06 from './styles/part-06.css?raw';
import css07a from './styles/part-07a.css?raw';
import css07b from './styles/part-07b.css?raw';
import css08 from './styles/part-08.css?raw';
import css09 from './styles/part-09.css?raw';
import css10 from './styles/part-10.css?raw';

const style = document.createElement('style');
style.dataset.dealerMotionStyles = 'true';
style.textContent = [css01, css02, css03, css04, css05, css06, css07a, css07b, css08, css09, css10].join('\n');
document.head.appendChild(style);

const RESERVED_ROOT_ROUTES = new Set(['inventory', 'vehicle', 'dealer-login', 'dashboard', 'resin', 'flooring']);
const RESIN_BUILD_ID = 'react-3d-full-site-20260807';
const FLOORING_BUILD_ID = 'aco-flooring-20260729';

function getPreviewRoute(pathname) {
  const firstSegment = pathname.split('/').filter(Boolean)[0] || '';
  if (!firstSegment || RESERVED_ROOT_ROUTES.has(firstSegment)) {
    return { slug: '', basePath: '' };
  }
  return { slug: firstSegment, basePath: `/${firstSegment}` };
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function showConfigError(slug, message) {
  const root = document.getElementById('root');
  root.innerHTML = `
    <main style="min-height:100vh;display:grid;place-items:center;padding:32px;background:#080a0c;color:#f7f4ee;font-family:Inter,system-ui,sans-serif">
      <section style="width:min(620px,100%);padding:34px;border:1px solid rgba(255,255,255,.16);border-radius:22px;background:#111519">
        <p style="margin:0 0 12px;color:#a9ff68;font-size:12px;letter-spacing:.14em;text-transform:uppercase">Preview unavailable</p>
        <h1 style="margin:0 0 12px;font-size:clamp(30px,6vw,54px);line-height:1">We couldn't load this business.</h1>
        <p style="margin:0;color:#b8bec6;line-height:1.6">No published configuration was found for <strong style="color:#fff">${escapeHtml(slug)}</strong>. ${escapeHtml(message)}</p>
      </section>
    </main>`;
}

async function loadPreviewConfig() {
  const { slug, basePath } = getPreviewRoute(window.location.pathname);
  globalThis.__PLATRIK_PREVIEW_BASE__ = basePath;
  if (!slug) return { slug, lead: null };

  const owner = import.meta.env.VITE_PREVIEW_DATA_OWNER || 'platrik-previews';
  const repository = import.meta.env.VITE_PREVIEW_DATA_REPO || 'dealer-preview-data';
  const branch = import.meta.env.VITE_PREVIEW_DATA_BRANCH || 'main';
  const rawUrl = `https://raw.githubusercontent.com/${owner}/${repository}/${branch}/leads/${encodeURIComponent(slug)}.json`;
  const response = await fetch(`${rawUrl}?v=${Date.now()}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Configuration request returned HTTP ${response.status}.`);

  const lead = await response.json();
  if (!lead || typeof lead.companyName !== 'string' || !lead.companyName.trim()) {
    throw new Error('The published configuration is incomplete.');
  }

  globalThis.__PLATRIK_LEAD__ = lead;
  return { slug, lead };
}

function buildRendererParams(slug, buildId, options = {}) {
  const fallbackRoute = `/${encodeURIComponent(slug)}/`;
  let publicRoute = fallbackRoute;

  if (options.preserveNestedRoute === true) {
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const candidate = window.location.pathname.endsWith('/') ? window.location.pathname : `${window.location.pathname}/`;
    const safePattern = /^\/[a-z0-9][a-z0-9-]*(?:\/[a-z0-9][a-z0-9-]*)*\/?$/i;
    if (pathSegments[0] === slug && safePattern.test(candidate)) {
      publicRoute = candidate;
    }
  }

  const params = new URLSearchParams({ slug, route: publicRoute, build: buildId });
  const engagementToken = new URLSearchParams(window.location.search).get('pt');
  if (/^[A-Za-z0-9_-]{30,200}$/.test(engagementToken || '')) {
    params.set('pt', engagementToken);
  }
  return params;
}

function renderResinPreview(slug) {
  window.location.replace(`/resin/index.html?${buildRendererParams(slug, RESIN_BUILD_ID, { preserveNestedRoute: true }).toString()}`);
}

function renderFlooringPreview(slug) {
  window.location.replace(`/flooring/index.html?${buildRendererParams(slug, FLOORING_BUILD_ID).toString()}`);
}

async function bootstrap() {
  let slug = '';
  try {
    const loaded = await loadPreviewConfig();
    slug = loaded.slug;
    if (loaded.lead?.renderer === 'resin_driveway') {
      renderResinPreview(loaded.slug);
      return;
    }
    if (loaded.lead?.renderer === 'flooring') {
      renderFlooringPreview(loaded.slug);
      return;
    }

    const { default: App } = await import('./App');
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  } catch (error) {
    console.error('Preview bootstrap failed:', error);
    showConfigError(slug || 'this route', error instanceof Error ? error.message : 'The preview could not be loaded.');
  }
}

bootstrap();
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

// The stylesheet is stored in smaller GitHub-friendly fragments. Vite imports
// each fragment as text, then the browser parses the complete stylesheet once.
const style = document.createElement('style');
style.dataset.dealerMotionStyles = 'true';
style.textContent = [css01, css02, css03, css04, css05, css06, css07a, css07b, css08, css09, css10].join('\n');
document.head.appendChild(style);

const RESERVED_ROOT_ROUTES = new Set(['inventory', 'vehicle', 'dealer-login', 'dashboard']);

function getPreviewRoute(pathname) {
  const firstSegment = pathname.split('/').filter(Boolean)[0] || '';
  if (!firstSegment || RESERVED_ROOT_ROUTES.has(firstSegment)) {
    return { slug: '', basePath: '' };
  }
  return { slug: firstSegment, basePath: `/${firstSegment}` };
}

function showConfigError(slug, message) {
  const root = document.getElementById('root');
  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
  const safeSlug = escapeHtml(slug);
  const safeMessage = escapeHtml(message);
  root.innerHTML = `
    <main style="min-height:100vh;display:grid;place-items:center;padding:32px;background:#080a0c;color:#f7f4ee;font-family:Inter,system-ui,sans-serif">
      <section style="width:min(620px,100%);padding:34px;border:1px solid rgba(255,255,255,.16);border-radius:22px;background:#111519">
        <p style="margin:0 0 12px;color:#a9ff68;font-size:12px;letter-spacing:.14em;text-transform:uppercase">Preview unavailable</p>
        <h1 style="margin:0 0 12px;font-size:clamp(30px,6vw,54px);line-height:1">We couldn't load this dealership.</h1>
        <p style="margin:0;color:#b8bec6;line-height:1.6">No published configuration was found for <strong style="color:#fff">${safeSlug}</strong>. ${safeMessage}</p>
      </section>
    </main>
  `;
}

async function loadPreviewConfig() {
  const { slug, basePath } = getPreviewRoute(window.location.pathname);
  globalThis.__PLATRIK_PREVIEW_BASE__ = basePath;

  if (!slug) return;

  const owner = import.meta.env.VITE_PREVIEW_DATA_OWNER || 'platrik-previews';
  const repository = import.meta.env.VITE_PREVIEW_DATA_REPO || 'dealer-preview-data';
  const branch = import.meta.env.VITE_PREVIEW_DATA_BRANCH || 'main';
  const rawUrl = `https://raw.githubusercontent.com/${owner}/${repository}/${branch}/leads/${encodeURIComponent(slug)}.json`;
  const response = await fetch(`${rawUrl}?v=${Date.now()}`, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Configuration request returned HTTP ${response.status}.`);
  }

  const lead = await response.json();
  if (!lead || typeof lead.companyName !== 'string' || !lead.companyName.trim()) {
    throw new Error('The published configuration is incomplete.');
  }

  globalThis.__PLATRIK_LEAD__ = lead;
}

async function bootstrap() {
  const { slug } = getPreviewRoute(window.location.pathname);

  try {
    await loadPreviewConfig();
    const { default: App } = await import('./App');
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  } catch (error) {
    console.error('Preview bootstrap failed:', error);
    showConfigError(slug || 'this route', error.message);
  }
}

bootstrap();

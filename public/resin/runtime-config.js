(() => {
  const FALLBACK_NAME = 'StoneFlow Resin';
  const FALLBACK_SHORT_NAME = 'StoneFlow';
  const FALLBACK_PHONE = '01234 567 890';
  const FALLBACK_PHONE_HREF = 'tel:+441234567890';
  const FALLBACK_EMAIL = 'hello@stoneflowresin.co.uk';

  const text = (value) => typeof value === 'string' ? value.trim() : '';
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug')
    || window.location.pathname.split('/').filter(Boolean)[0]
    || '';

  if (!slug) return;

  const requestedRoute = text(params.get('route'));
  const safeRoute = /^\/[a-z0-9][a-z0-9-]*\/?$/i.test(requestedRoute)
    ? requestedRoute
    : `/${slug}/`;
  const publicRoute = safeRoute.endsWith('/') ? safeRoute : `${safeRoute}/`;

  if (window.top === window.self) {
    try {
      window.history.replaceState({ platrikResinPreview: true }, '', publicRoute);
    } catch {
      // The preview still works even if a browser blocks the cosmetic URL replacement.
    }
  }

  const rawUrl = `https://raw.githubusercontent.com/platrik-previews/dealer-preview-data/main/leads/${encodeURIComponent(slug)}.json`;

  const replaceText = (root, replacements) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      let value = node.nodeValue || '';
      for (const [from, to] of replacements) {
        if (from && to) value = value.split(from).join(to);
      }
      node.nodeValue = value;
    }
  };

  const setMeta = (selector, value) => {
    if (!value) return;
    const element = document.querySelector(selector);
    if (element) element.setAttribute('content', value);
  };

  const applyLogo = (logoUrl, companyName) => {
    if (!logoUrl) return;
    document.querySelectorAll('.brand-mark').forEach((mark) => {
      mark.innerHTML = '';
      mark.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;';
      const image = document.createElement('img');
      image.src = logoUrl;
      image.alt = `${companyName} logo`;
      image.loading = 'eager';
      image.referrerPolicy = 'no-referrer';
      image.style.cssText = 'display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;';
      mark.appendChild(image);
    });
  };

  const applyConfig = (config) => {
    const companyName = text(config.companyName) || FALLBACK_NAME;
    const shortName = text(config.shortName) || companyName;
    const descriptor = text(config.descriptor) || 'Resin & Surfacing';
    const phoneDisplay = text(config.phoneDisplay) || FALLBACK_PHONE;
    const phoneHref = text(config.phoneLink) || FALLBACK_PHONE_HREF;
    const email = text(config.email) || FALLBACK_EMAIL;
    const address = text(config.address);
    const serviceAreas = Array.isArray(config.serviceAreas)
      ? config.serviceAreas.map(text).filter(Boolean)
      : [];
    const logoUrl = text(config.logoUrl || config.logo_url);

    document.title = `${companyName} | Premium Resin-Bound Driveways`;
    setMeta('meta[name="description"]', `${companyName} installs premium resin-bound driveways, paths and patios${address ? ` across ${address}` : ''}.`);
    setMeta('meta[property="og:title"]', `${companyName} — Premium Resin-Bound Driveways`);
    setMeta('meta[property="og:description"]', `A personalised resin-bound driveway website preview for ${companyName}.`);
    document.querySelector('meta[name="robots"]')?.setAttribute('content', 'noindex, nofollow, noarchive');

    replaceText(document.body, [
      [FALLBACK_NAME, companyName],
      [FALLBACK_SHORT_NAME, shortName],
      [FALLBACK_PHONE, phoneDisplay],
      [FALLBACK_EMAIL, email],
    ]);

    document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
      link.setAttribute('href', phoneHref.startsWith('tel:') ? phoneHref : `tel:${phoneHref}`);
    });
    document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
      link.setAttribute('href', `mailto:${email}`);
    });
    document.querySelectorAll('.brand').forEach((brand) => {
      brand.setAttribute('aria-label', `${companyName} home`);
    });
    document.querySelectorAll('.brand-copy strong').forEach((node) => { node.textContent = shortName; });
    document.querySelectorAll('.brand-copy small').forEach((node) => { node.textContent = descriptor; });

    const heroEyebrow = document.querySelector('.hero-opening .eyebrow');
    if (heroEyebrow && serviceAreas.length) {
      heroEyebrow.innerHTML = `<span></span> Resin-bound surfaces · ${serviceAreas.join(' · ')}`;
    }

    const areaColumn = [...document.querySelectorAll('.footer-grid > div')]
      .find((column) => column.querySelector('span')?.textContent?.trim() === 'Areas');
    if (areaColumn && serviceAreas.length) {
      areaColumn.querySelectorAll('p').forEach((node) => node.remove());
      serviceAreas.forEach((area) => {
        const paragraph = document.createElement('p');
        paragraph.textContent = area;
        areaColumn.appendChild(paragraph);
      });
    }

    applyLogo(logoUrl, companyName);

    const schema = document.querySelector('script[type="application/ld+json"]');
    if (schema) {
      try {
        const data = JSON.parse(schema.textContent || '{}');
        data.name = companyName;
        data.telephone = phoneHref.replace(/^tel:/, '');
        data.email = email;
        if (serviceAreas.length) data.areaServed = serviceAreas;
        schema.textContent = JSON.stringify(data);
      } catch {
        // Keep the original valid schema rather than interrupting the page.
      }
    }

    document.documentElement.dataset.runtimePersonalized = 'true';
  };

  fetch(`${rawUrl}?v=${Date.now()}`, { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error(`Runtime JSON returned HTTP ${response.status}`);
      return response.json();
    })
    .then(applyConfig)
    .catch((error) => {
      console.warn('Resin preview personalization unavailable; original static site remains visible.', error);
      document.documentElement.dataset.runtimePersonalized = 'fallback';
    });
})();

(() => {
  const params = new URLSearchParams(location.search);
  const slug = (params.get('slug') || location.pathname.split('/').filter(Boolean)[0] || '').trim();
  const owner = 'platrik-previews';
  const repo = 'dealer-preview-data';
  const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/leads/${encodeURIComponent(slug)}.json`;

  const setText = (selector, value) => {
    if (!value) return;
    document.querySelectorAll(selector).forEach((node) => { node.textContent = value; });
  };
  const setLinks = (selector, value) => {
    document.querySelectorAll(selector).forEach((node) => {
      if (value) { node.href = value; node.hidden = false; }
      else { node.hidden = true; }
    });
  };

  window.__PLATRIK_FLOORING__ = { slug, instagram: 'https://www.instagram.com/acoflooring/', facebook: '' };

  fetch(`${rawUrl}?v=${Date.now()}`, { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error(`Configuration request returned HTTP ${response.status}.`);
      return response.json();
    })
    .then((config) => {
      if (!config || !config.companyName) throw new Error('The published configuration is incomplete.');
      if (config.renderer && config.renderer !== 'flooring') throw new Error('This route is not configured for the flooring renderer.');
      window.__PLATRIK_FLOORING__ = { ...config, slug };
      setText('[data-business-name]', config.companyName);
      setText('[data-business-descriptor]', config.descriptor || 'Flooring Specialists');
      setLinks('[data-instagram-link]', config.instagram);
      setLinks('[data-facebook-link]', config.facebook);
      document.title = `${config.companyName} | Flooring`;
      document.querySelector('meta[name="description"]')?.setAttribute('content', `${config.companyName} personalised flooring website preview.`);
      if (config.logoPath) {
        const image = document.querySelector('[data-logo-image]');
        const imageWrap = document.querySelector('[data-logo-image-wrap]');
        const markWrap = document.querySelector('[data-logo-wrap]');
        if (image && imageWrap) {
          image.src = config.logoPath;
          image.alt = `${config.companyName} logo`;
          imageWrap.hidden = false;
          if (markWrap) markWrap.hidden = true;
        }
      }
      document.dispatchEvent(new CustomEvent('platrik:flooring-config', { detail: config }));
    })
    .catch((error) => {
      console.error('Flooring preview configuration failed:', error);
      setLinks('[data-instagram-link]', window.__PLATRIK_FLOORING__.instagram);
      setLinks('[data-facebook-link]', window.__PLATRIK_FLOORING__.facebook);
    });
})();

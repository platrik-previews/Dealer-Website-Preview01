(() => {
  'use strict';

  const token = new URLSearchParams(window.location.search).get('pt') || '';
  if (!/^[A-Za-z0-9_-]{30,200}$/.test(token)) return;

  const endpoint = `https://platrik-crm.platrik-work.workers.dev/api/track/preview/${encodeURIComponent(token)}`;
  let interactionSeen = false;
  let minimumTimeReached = false;
  let engagedSent = false;

  const send = (event) => {
    try {
      fetch(endpoint, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event })
      }).catch(() => undefined);
    } catch {
      // Preview rendering is never blocked by optional engagement tracking.
    }
  };

  const maybeSendEngaged = () => {
    if (engagedSent || !interactionSeen || !minimumTimeReached) return;
    engagedSent = true;
    send('engaged');
  };

  const markInteraction = () => {
    interactionSeen = true;
    maybeSendEngaged();
  };

  send('visited');

  window.setTimeout(() => {
    minimumTimeReached = true;
    maybeSendEngaged();
  }, 8000);

  let initialScroll = window.scrollY;
  const onScroll = () => {
    if (Math.abs(window.scrollY - initialScroll) >= 80) {
      markInteraction();
      window.removeEventListener('scroll', onScroll);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('pointerdown', markInteraction, { once: true, passive: true });
  window.addEventListener('keydown', markInteraction, { once: true });

  // Remove the opaque token after the renderer has had time to perform any
  // niche hand-off. The token stays only in memory and no cookie is created.
  window.setTimeout(() => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('pt');
      window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
    } catch {
      // Cosmetic URL cleanup is optional.
    }
  }, 2500);
})();

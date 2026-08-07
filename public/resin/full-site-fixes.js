(() => {
  const layoutFix = document.createElement('style');
  layoutFix.dataset.resinFullSiteHotfix = 'footer-gap';
  layoutFix.textContent = `
    html[data-resin-route="home"] #resin-full-site,
    html:not([data-resin-route]) #resin-full-site {
      display: none !important;
      min-height: 0 !important;
      height: 0 !important;
      overflow: hidden !important;
    }

    html[data-resin-route="subpage"] #resin-full-site {
      display: block !important;
      min-height: 100vh !important;
      height: auto !important;
      overflow: visible !important;
    }
  `;
  document.head.appendChild(layoutFix);

  function normalizeLandingMenuLabels() {
    document.querySelectorAll('.mobile-menu nav button').forEach((button) => {
      if (!button.textContent.toLowerCase().includes('project planner')) return;
      button.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.toLowerCase().includes('project planner')) {
          node.textContent = node.textContent.replace(/project planner/i, 'Planner');
        }
      });
    });
  }

  normalizeLandingMenuLabels();
  const observer = new MutationObserver(normalizeLandingMenuLabels);
  observer.observe(document.body, { childList: true, subtree: true });
})();
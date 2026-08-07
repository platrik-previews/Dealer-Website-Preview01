(() => {
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

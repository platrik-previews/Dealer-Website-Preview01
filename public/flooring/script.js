(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  document.documentElement.style.setProperty('--hero-progress', '0');
  $('[data-year]').textContent = new Date().getFullYear();

  const header = $('[data-header]');
  const hero = $('[data-hero]');
  const cursor = $('.cursor-glow');
  let ticking = false;

  function updateScroll() {
    const y = window.scrollY;
    header?.classList.toggle('is-scrolled', y > 40);
    if (hero) {
      const max = Math.max(1, hero.offsetHeight - innerHeight);
      const progress = Math.min(1, Math.max(0, (y - hero.offsetTop) / max));
      document.documentElement.style.setProperty('--hero-progress', progress.toFixed(4));
    }
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); } }, { passive: true });
  updateScroll();
  addEventListener('pointermove', (event) => {
    if (!cursor || matchMedia('(pointer:coarse)').matches) return;
    cursor.style.transform = `translate3d(${event.clientX - 180}px,${event.clientY - 180}px,0)`;
  }, { passive: true });

  const menu = $('[data-mobile-menu]');
  const setMenu = (open) => {
    if (!menu) return;
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    $('[data-menu-toggle]')?.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  };
  $('[data-menu-toggle]')?.addEventListener('click', () => setMenu(true));
  $('[data-menu-close]')?.addEventListener('click', () => setMenu(false));
  $$('a', menu).forEach((link) => link.addEventListener('click', () => setMenu(false)));

  const projects = [
    { title: 'Warm oak living space', subtitle: 'Natural oak · warm, timeless finish', image: 'https://images.pexels.com/photos/7027844/pexels-photo-7027844.jpeg?auto=compress&cs=tinysrgb&w=1800' },
    { title: 'Light plank open plan', subtitle: 'Pale ash · bright, modern tone', image: 'https://images.pexels.com/photos/7027720/pexels-photo-7027720.jpeg?auto=compress&cs=tinysrgb&w=1800' },
    { title: 'Seamless kitchen flow', subtitle: 'Soft natural plank · continuous room flow', image: 'https://images.pexels.com/photos/11018249/pexels-photo-11018249.jpeg?auto=compress&cs=tinysrgb&w=1800' },
    { title: 'Precision plank fitting', subtitle: 'Straight plank · detail-led installation', image: 'https://images.pexels.com/photos/4263067/pexels-photo-4263067.jpeg?auto=compress&cs=tinysrgb&w=1800' },
  ];
  let activeProject = 0;
  const projectRail = $('[data-project-rail]');
  const renderProject = (index) => {
    activeProject = index;
    const project = projects[index];
    $('[data-project-image]').src = project.image;
    $('[data-project-title]').textContent = project.title;
    $('[data-project-subtitle]').textContent = project.subtitle;
    $('[data-project-count]').textContent = `${String(index + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`;
    $$('button', projectRail).forEach((button, itemIndex) => button.classList.toggle('is-active', itemIndex === index));
  };
  projects.forEach((project, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = `<img src="${project.image}" alt=""><span><small>${String(index + 1).padStart(2, '0')}</small><strong>${project.title}</strong></span>`;
    button.addEventListener('click', () => renderProject(index));
    projectRail?.appendChild(button);
  });
  renderProject(0);
  $('[data-project-feature]')?.addEventListener('click', () => renderProject((activeProject + 1) % projects.length));

  const finishes = [
    { name: 'Natural Oak', value: '#aa8558', grain: '#d7bb8d', mood: 'Warm and timeless' },
    { name: 'Pale Ash', value: '#c3b79e', grain: '#eee3cc', mood: 'Light and architectural' },
    { name: 'Smoked Oak', value: '#685447', grain: '#a98f78', mood: 'Rich and contemporary' },
    { name: 'Warm Walnut', value: '#79543d', grain: '#bd8e68', mood: 'Deep and characterful' },
    { name: 'Soft Grey', value: '#999994', grain: '#d6d4cd', mood: 'Quiet and versatile' },
  ];
  const floor = $('[data-room-floor]');
  const swatches = $('[data-swatches]');
  let activeFinish = 0;
  let activeLayout = 'straight';
  const updateFloor = () => {
    const finish = finishes[activeFinish];
    floor.style.setProperty('--floor', finish.value);
    floor.style.setProperty('--grain', finish.grain);
    floor.dataset.layout = activeLayout;
    $('[data-finish-name]').textContent = finish.name;
    $('[data-finish-mood]').textContent = finish.mood;
    $$('button', swatches).forEach((button, index) => button.classList.toggle('is-active', index === activeFinish));
  };
  finishes.forEach((finish, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = `<i style="--swatch:${finish.value};--grain:${finish.grain}"></i><span>${finish.name}</span>`;
    button.addEventListener('click', () => { activeFinish = index; updateFloor(); });
    swatches?.appendChild(button);
  });
  $$('[data-layout]').forEach((button) => button.addEventListener('click', () => {
    activeLayout = button.dataset.layout;
    $$('[data-layout]').forEach((item) => item.classList.toggle('is-active', item === button));
    updateFloor();
  }));
  updateFloor();

  const planner = { room: 'Living room', material: 'Wood-effect plank', current: 'Not sure', area: 35 };
  const refreshPlanner = () => {
    $('[data-area-output]').textContent = planner.area;
    $('[data-brief-title]').textContent = `${planner.room} flooring`;
    $('[data-brief-copy]').textContent = `${planner.material} · approximately ${planner.area} m² · current floor: ${planner.current}.`;
  };
  $$('[data-choice]').forEach((group) => $$('button', group).forEach((button) => button.addEventListener('click', () => {
    $$('button', group).forEach((item) => item.classList.toggle('is-active', item === button));
    planner[group.dataset.choice] = button.dataset.value;
    refreshPlanner();
  })));
  $('[data-area]')?.addEventListener('input', (event) => { planner.area = Number(event.target.value); refreshPlanner(); });
  refreshPlanner();

  $$('[data-faq-list] article > button').forEach((button) => button.addEventListener('click', () => {
    const article = button.closest('article');
    const wasOpen = article.classList.contains('is-open');
    $$('[data-faq-list] article').forEach((item) => item.classList.remove('is-open'));
    if (!wasOpen) article.classList.add('is-open');
  }));

  const modal = $('[data-enquiry-modal]');
  const enquiryForm = $('[data-enquiry-form]');
  const openModal = (usePlanner = false) => {
    if (!modal) return;
    if (usePlanner && enquiryForm) {
      enquiryForm.elements.project.value = `${planner.room} flooring`;
      enquiryForm.elements.area.value = `${planner.area} m²`;
      enquiryForm.elements.notes.value = `${planner.material}. Current floor: ${planner.current}.`;
    }
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    setTimeout(() => enquiryForm?.elements.name.focus(), 80);
  };
  const closeModal = () => { modal?.classList.remove('is-open'); modal?.setAttribute('aria-hidden', 'true'); document.body.classList.remove('modal-open'); };
  $$('[data-open-enquiry]').forEach((button) => button.addEventListener('click', () => openModal(button.hasAttribute('data-use-planner'))));
  $$('[data-close-enquiry]').forEach((button) => button.addEventListener('click', closeModal));
  addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeModal(); setMenu(false); } });

  enquiryForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(enquiryForm);
    const business = window.__PLATRIK_FLOORING__ || {};
    const message = [
      `Hi ${business.companyName || 'ACO Flooring'}, I would like to discuss a flooring project.`,
      `Name: ${data.get('name')}`,
      `Project: ${data.get('project')}`,
      `Approximate area: ${data.get('area') || 'Not supplied'}`,
      `Details: ${data.get('notes') || 'No additional details yet'}`,
    ].join('\n');
    try { await navigator.clipboard.writeText(message); }
    catch {
      const area = document.createElement('textarea'); area.value = message; document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove();
    }
    const instagram = business.instagram || 'https://www.instagram.com/acoflooring/';
    window.open(instagram, '_blank', 'noopener,noreferrer');
    closeModal();
  });

  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.12 });
  $$('.reveal').forEach((node) => observer.observe(node));
})();

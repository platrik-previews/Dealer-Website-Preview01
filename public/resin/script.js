const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const mapRange = (value, start, end) => clamp((value - start) / Math.max(0.0001, end - start));
const money = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 });
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const hero = document.querySelector('[data-hero]');
const header = document.querySelector('[data-header]');
const mobileActions = document.querySelector('.mobile-actions');
let heroFrame = 0;

function updateHero() {
  heroFrame = 0;
  if (!hero || reduceMotion) return;
  const rect = hero.getBoundingClientRect();
  const scrollable = Math.max(1, hero.offsetHeight - window.innerHeight);
  const progress = clamp(-rect.top / scrollable);
  const intro = 1 - mapRange(progress, 0.04, 0.2);
  const explode = mapRange(progress, 0.12, 0.37);
  const build = mapRange(progress, 0.31, 0.63);
  const finish = mapRange(progress, 0.58, 0.8);
  const final = mapRange(progress, 0.79, 0.94);
  hero.style.setProperty('--hero-progress', progress.toFixed(4));
  hero.style.setProperty('--hero-intro', intro.toFixed(4));
  hero.style.setProperty('--hero-explode', explode.toFixed(4));
  hero.style.setProperty('--hero-build', build.toFixed(4));
  hero.style.setProperty('--hero-finish', finish.toFixed(4));
  hero.style.setProperty('--hero-final', final.toFixed(4));
  hero.classList.toggle('is-final', final > 0.74);
  hero.classList.toggle('is-past-opening', progress > 0.22);
}

function requestHeroUpdate() {
  if (!heroFrame) heroFrame = requestAnimationFrame(updateHero);
}

function updateChrome() {
  const scrolled = window.scrollY > 40;
  header?.classList.toggle('is-scrolled', scrolled);
  mobileActions?.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.72);
}

window.addEventListener('scroll', () => {
  requestHeroUpdate();
  updateChrome();
}, { passive: true });
window.addEventListener('resize', requestHeroUpdate);
updateHero();
updateChrome();

if (!reduceMotion && hero) {
  hero.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 7;
    const y = ((event.clientY - rect.top) / Math.min(rect.height, window.innerHeight) - 0.5) * -5;
    hero.style.setProperty('--pointer-x', `${x.toFixed(2)}deg`);
    hero.style.setProperty('--pointer-y', `${y.toFixed(2)}deg`);
  });
  hero.addEventListener('pointerleave', () => {
    hero.style.setProperty('--pointer-x', '0deg');
    hero.style.setProperty('--pointer-y', '0deg');
  });
}

const cursorOrb = document.querySelector('.cursor-orb');
if (cursorOrb && !reduceMotion && matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`);
    document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`);
  }, { passive: true });
}

const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
function closeMenu() {
  menuToggle?.setAttribute('aria-expanded', 'false');
  mobileMenu?.classList.remove('is-open');
  mobileMenu?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
}
menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  mobileMenu?.classList.toggle('is-open', !open);
  mobileMenu?.setAttribute('aria-hidden', String(open));
  document.body.classList.toggle('menu-open', !open);
});
mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.14, rootMargin: '0px 0px -5% 0px' });
document.querySelectorAll('.reveal-up, .reveal-scale').forEach((element) => observer.observe(element));

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const target = entry.target;
    const end = Number(target.dataset.count || 0);
    const suffix = target.dataset.suffix || '';
    const startTime = performance.now();
    const duration = 1100;
    const animate = (time) => {
      const progress = clamp((time - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      target.textContent = `${Math.round(end * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    countObserver.unobserve(target);
  });
}, { threshold: .7 });
document.querySelectorAll('[data-count]').forEach((element) => countObserver.observe(element));

if (!reduceMotion && matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.magnetic').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * .13;
      const y = (event.clientY - rect.top - rect.height / 2) * .13;
      element.style.transform = `translate(${x}px, ${y}px)`;
    });
    element.addEventListener('pointerleave', () => { element.style.transform = ''; });
  });
}

const projects = [
  {
    type: 'Residential driveway',
    title: 'Warm stone arrival',
    description: 'A continuous warm aggregate surface shaped around a modern property, with subtle edging and generous vehicle access.',
    finish: 'Warm quartz blend',
    detail: 'Curved stone edging',
    area: 'Residential frontage',
    image: 'assets/project-01.webp',
    alt: 'Warm resin-bound driveway around a modern property'
  },
  {
    type: 'Courtyard',
    title: 'Continuous movement',
    description: 'A resin-bound courtyard designed to connect multiple thresholds and circulation routes without visual interruption.',
    finish: 'Natural stone blend',
    detail: 'Seamless transitions',
    area: 'Courtyard & paths',
    image: 'assets/project-02.webp',
    alt: 'Resin-bound courtyard with a seamless stone finish'
  },
  {
    type: 'Large frontage',
    title: 'Architectural scale',
    description: 'A broad resin surface that balances practical access with retaining walls, planted areas and the architecture of the property.',
    finish: 'Earth-toned aggregate',
    detail: 'Large-format layout',
    area: 'Extended frontage',
    image: 'assets/project-05.webp',
    alt: 'Large resin-bound surface with architectural landscaping'
  },
  {
    type: 'Design-led driveway',
    title: 'Geometry in gold',
    description: 'A warm golden surface divided with crisp darker bands to create a stronger architectural relationship with the house.',
    finish: 'Golden aggregate',
    detail: 'Geometric border',
    area: 'Driveway & entrance',
    image: 'assets/project-03.webp',
    alt: 'Golden resin-bound driveway with geometric dark edging'
  }
];
const modal = document.querySelector('[data-project-modal]');
function openProject(index) {
  const project = projects[index];
  if (!modal || !project) return;
  modal.querySelector('[data-modal-image]').src = project.image;
  modal.querySelector('[data-modal-image]').alt = project.alt;
  modal.querySelector('[data-modal-type]').textContent = project.type;
  modal.querySelector('[data-modal-title]').textContent = project.title;
  modal.querySelector('[data-modal-description]').textContent = project.description;
  modal.querySelector('[data-modal-finish]').textContent = project.finish;
  modal.querySelector('[data-modal-detail]').textContent = project.detail;
  modal.querySelector('[data-modal-area]').textContent = project.area;
  modal.showModal();
}
document.querySelectorAll('[data-project]').forEach((card) => card.addEventListener('click', () => openProject(Number(card.dataset.project))));
modal?.querySelector('.project-modal__close')?.addEventListener('click', () => modal.close());
modal?.addEventListener('click', (event) => { if (event.target === modal) modal.close(); });
modal?.querySelector('a[href="#quote"]')?.addEventListener('click', () => modal.close());

const finishData = {
  quartz: { name: 'Golden Quartz', colour: 'rgba(205, 157, 69, .44)' },
  silver: { name: 'Silver Granite', colour: 'rgba(145, 151, 149, .48)' },
  pearl: { name: 'Autumn Pearl', colour: 'rgba(171, 111, 72, .43)' },
  charcoal: { name: 'Charcoal Mist', colour: 'rgba(54, 61, 59, .58)' }
};
const edgeData = {
  charcoal: { name: 'Charcoal', colour: '#35393a', opacity: '.92' },
  stone: { name: 'Natural stone', colour: '#b4a082', opacity: '.92' },
  none: { name: 'Seamless', colour: 'transparent', opacity: '0' }
};
const finishPreview = document.querySelector('[data-finish-preview]');
document.querySelectorAll('[data-finish]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-finish]').forEach((item) => item.classList.remove('is-active'));
  button.classList.add('is-active');
  const finish = finishData[button.dataset.finish];
  finishPreview?.style.setProperty('--preview-color', finish.colour);
  document.querySelector('[data-selected-finish]').textContent = finish.name;
}));
document.querySelectorAll('[data-edge]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-edge]').forEach((item) => item.classList.remove('is-active'));
  button.classList.add('is-active');
  const edge = edgeData[button.dataset.edge];
  finishPreview?.style.setProperty('--border-color', edge.colour);
  finishPreview?.style.setProperty('--border-opacity', edge.opacity);
  document.querySelector('[data-selected-edge]').textContent = edge.name;
}));

const processSteps = [...document.querySelectorAll('[data-step]')];
const processNumber = document.querySelector('[data-process-number]');
const processLabel = document.querySelector('[data-process-label]');
const processLabels = ['Survey', 'Groundwork', 'Base & drainage', 'Resin finish', 'Handover'];
const processObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  const index = Number(visible.target.dataset.step);
  processSteps.forEach((step) => step.classList.toggle('is-active', Number(step.dataset.step) === index));
  if (processNumber) processNumber.textContent = String(index + 1).padStart(2, '0');
  if (processLabel) processLabel.textContent = processLabels[index];
}, { threshold: [0.35, 0.6, 0.85], rootMargin: '-20% 0px -35% 0px' });
processSteps.forEach((step) => processObserver.observe(step));

const planner = document.querySelector('[data-planner]');
if (planner) {
  const steps = [...planner.querySelectorAll('[data-planner-step]')];
  const progressBars = [...planner.querySelectorAll('.planner-progress span')];
  const result = planner.querySelector('[data-planner-result]');
  const areaInput = planner.querySelector('#area-range');
  const areaOutput = planner.querySelector('[data-area-output]');
  let stepIndex = 0;
  let base = 'prepared';

  const showStep = (index) => {
    stepIndex = clamp(index, 0, steps.length - 1);
    steps.forEach((step, i) => step.classList.toggle('is-active', i === stepIndex));
    result.classList.remove('is-active');
    progressBars.forEach((bar, i) => bar.classList.toggle('is-active', i <= stepIndex));
  };
  areaInput.addEventListener('input', () => { areaOutput.textContent = areaInput.value; });
  planner.querySelectorAll('.planner-next').forEach((button) => button.addEventListener('click', () => showStep(stepIndex + 1)));
  planner.querySelectorAll('.planner-back').forEach((button) => button.addEventListener('click', () => showStep(stepIndex - 1)));
  planner.querySelectorAll('[data-base]').forEach((button) => button.addEventListener('click', () => {
    planner.querySelectorAll('[data-base]').forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    base = button.dataset.base;
  }));
  planner.querySelector('[data-calculate]').addEventListener('click', () => {
    const area = Number(areaInput.value);
    const baseRates = { prepared: 78, block: 98, gravel: 112, unknown: 100 };
    let total = area * baseRates[base] + 650;
    const details = [...planner.querySelectorAll('.planner-checks input:checked')].map((input) => input.value);
    if (details.includes('border')) total += area * 7;
    if (details.includes('steps')) total += 700;
    if (details.includes('drainage')) total += 850;
    const min = Math.round(total * .92 / 100) * 100;
    const max = Math.round(total * 1.16 / 100) * 100;
    planner.querySelector('[data-price-min]').textContent = money.format(min);
    planner.querySelector('[data-price-max]').textContent = money.format(max);
    const baseText = { prepared: 'a potentially suitable existing base', block: 'an existing block-paved surface', gravel: 'a likely full ground build-up', unknown: 'a base requiring survey assessment' }[base];
    const extras = details.length ? ` plus ${details.map((item) => ({ border: 'border detailing', steps: 'level changes', drainage: 'drainage alterations' }[item])).join(', ')}` : '';
    planner.querySelector('[data-result-copy]').textContent = `Based on approximately ${area}m² with ${baseText}${extras}.`;
    steps.forEach((step) => step.classList.remove('is-active'));
    result.classList.add('is-active');
    progressBars.forEach((bar) => bar.classList.add('is-active'));
  });
  planner.querySelector('[data-restart]').addEventListener('click', () => showStep(0));
  showStep(0);
}

document.querySelectorAll('.faq-item button').forEach((button) => button.addEventListener('click', () => {
  const item = button.closest('.faq-item');
  const open = item.classList.contains('is-open');
  document.querySelectorAll('.faq-item').forEach((other) => {
    other.classList.remove('is-open');
    other.querySelector('button').setAttribute('aria-expanded', 'false');
  });
  if (!open) {
    item.classList.add('is-open');
    button.setAttribute('aria-expanded', 'true');
  }
}));

const quoteForm = document.querySelector('[data-quote-form]');
quoteForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = quoteForm.querySelector('[data-form-status]');
  if (!quoteForm.checkValidity()) {
    quoteForm.reportValidity();
    status.textContent = 'Please complete the required details.';
    return;
  }
  const data = new FormData(quoteForm);
  const message = [
    'Hi StoneFlow, I would like to request a free site survey.',
    `Name: ${data.get('name')}`,
    `Phone: ${data.get('phone')}`,
    `Email: ${data.get('email')}`,
    `Postcode: ${data.get('postcode')}`,
    `Project: ${data.get('project')}`,
    `Approx. area: ${data.get('size')}`,
    `Details: ${data.get('message') || 'Not provided'}`
  ].join('\n');
  status.textContent = 'Opening WhatsApp with your project details…';
  const whatsappNumber = '441234567890';
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();

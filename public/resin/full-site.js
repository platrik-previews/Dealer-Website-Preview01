(() => {
  const qs = new URLSearchParams(window.location.search);
  const slug = (qs.get('slug') || '').trim();
  const requestedRoute = (qs.get('route') || '').trim();
  const safeRoute = /^\/[a-z0-9][a-z0-9-]*(?:\/[a-z0-9][a-z0-9-]*)*\/?$/i.test(requestedRoute)
    ? requestedRoute
    : slug ? `/${slug}/` : '/';
  const segments = safeRoute.split('/').filter(Boolean);
  const pageKey = (segments[1] || 'home').toLowerCase();
  const knownPages = new Set(['home', 'services', 'projects', 'process', 'finishes', 'about', 'areas', 'faq', 'contact']);
  const routeKey = knownPages.has(pageKey) ? pageKey : 'home';
  const homePath = slug ? `/${slug}/` : '/';
  const pathFor = (key) => key === 'home' ? homePath : `${homePath}${key}/`;

  const fallbackProjects = [
    { title: 'Warm stone entrance', location: 'Billericay, Essex', blend: 'Amber Drift', size: '86 m²', image: 'https://images.pexels.com/photos/8134821/pexels-photo-8134821.jpeg?auto=compress&cs=tinysrgb&w=1600', copy: 'A warm aggregate blend, dark block border and rebuilt drainage line transformed a tired frontage into a clean, welcoming entrance.' },
    { title: 'Contemporary family drive', location: 'Brentwood, Essex', blend: 'Silver Ash', size: '112 m²', image: 'https://images.pexels.com/photos/8134845/pexels-photo-8134845.jpeg?auto=compress&cs=tinysrgb&w=1600', copy: 'A light architectural finish designed to complement the property brickwork while creating comfortable parking for three vehicles.' },
    { title: 'Garden path system', location: 'Sevenoaks, Kent', blend: 'Meadow Flint', size: '48 m²', image: 'https://images.pexels.com/photos/10827225/pexels-photo-10827225.jpeg?auto=compress&cs=tinysrgb&w=1600', copy: 'Curved resin paths connect the patio, side access and garden room without introducing harsh joints or visual clutter.' },
    { title: 'Dark contrast approach', location: 'Loughton, Essex', blend: 'Graphite Pearl', size: '74 m²', image: 'https://images.pexels.com/photos/8134848/pexels-photo-8134848.jpeg?auto=compress&cs=tinysrgb&w=1600', copy: 'A darker UV-stable blend and charcoal edge sharpened the frontage of this modernised family home.' },
  ];

  const fallbackFinishes = [
    { name: 'Silver Ash', value: '#aaa89d', fleck: '#e1ddd2', mood: 'Clean and architectural' },
    { name: 'Amber Drift', value: '#b39364', fleck: '#e6cfa4', mood: 'Warm and welcoming' },
    { name: 'Meadow Flint', value: '#8b8b72', fleck: '#c8c3a7', mood: 'Natural and understated' },
    { name: 'Graphite Pearl', value: '#555752', fleck: '#9ea29a', mood: 'Bold and contemporary' },
    { name: 'Coastal Stone', value: '#9c9689', fleck: '#d9d0bd', mood: 'Soft and neutral' },
  ];

  const fallbackFaqs = [
    ['How long does a resin driveway take?', 'Most domestic installations take several working days, depending on excavation, drainage, edging, access and weather. The resin surface is normally laid near the end of the programme.'],
    ['Can resin be laid over an existing drive?', 'Sometimes. A stable, suitable base may allow an overlay, but cracked, moving or poorly drained surfaces should not simply be covered. Every project should start with a site assessment.'],
    ['Is a resin-bound driveway permeable?', 'A correctly specified resin-bound system can be permeable when installed over a suitable open-graded base. Drainage requirements should be assessed for the specific property.'],
    ['How much maintenance is required?', 'Routine sweeping and occasional pressure washing at a sensible pressure keeps most surfaces looking fresh. Stains are best dealt with promptly and harsh chemicals should be avoided unless recommended for the system.'],
    ['Will weeds grow through the surface?', 'Weeds do not normally grow through a correctly installed system, although airborne seeds can occasionally establish on top where debris is allowed to collect.'],
    ['Do you provide a written quotation?', 'A professional quotation should clearly set out preparation, edging, drainage, chosen finish and the agreed scope before work begins.'],
  ];

  const services = [
    { title: 'Resin-bound driveways', copy: 'A seamless, low-maintenance frontage designed around vehicle use, levels, drainage and the architecture of the property.', features: ['Full-build or suitable overlay assessment', 'Aggregate and border direction', 'Falls and drainage planning', 'Clean thresholds and access details'] },
    { title: 'Paths & entrances', copy: 'Continuous pedestrian routes that connect gates, doors and gardens without introducing visual clutter or loose stone.', features: ['Curves and transitions', 'Step and threshold detailing', 'Slip-conscious specification', 'Accessible route planning'] },
    { title: 'Patios & garden spaces', copy: 'Resin surfacing for terraces, seating zones and garden rooms where comfort, drainage and visual continuity matter together.', features: ['Furniture-friendly surface', 'Drainage around buildings', 'Border and feature bands', 'Connection to paths and lawns'] },
    { title: 'Ground preparation', copy: 'The invisible part of the project: excavation, formation, load-bearing sub-base and a stable base appropriate to the final system.', features: ['Existing surface assessment', 'Excavation where required', 'Compaction and levels', 'Base suitability checks'] },
    { title: 'Drainage & edging', copy: 'Permanent edges, channels and falls designed as part of the surface rather than treated as afterthoughts.', features: ['Linear channels where needed', 'Threshold drainage', 'Block or stone edging', 'Fall and outlet planning'] },
    { title: 'Resurfacing & repairs', copy: 'Assessment-led improvements for worn or damaged areas, including when an overlay may be appropriate and when rebuilding is the better option.', features: ['Crack and movement review', 'Base condition checks', 'Local repair assessment', 'Honest overlay suitability'] },
  ];

  const processSteps = [
    ['Survey & specification', 'Measure the site, review access and use, inspect the current surface, identify drainage constraints and agree the visual direction.'],
    ['Excavation & preparation', 'Remove unsuitable material where required and establish the formation to a depth appropriate for the project and ground conditions.'],
    ['Sub-base & levels', 'Install and compact the load-bearing layers, maintaining the levels and falls needed for performance and drainage.'],
    ['Drainage & permanent edges', 'Resolve channels, thresholds, borders and restraint details before the decorative surface is committed.'],
    ['Resin installation', 'Mechanically mix the selected aggregate and resin, then spread and hand-trowel the system to a consistent finish.'],
    ['Handover & aftercare', 'Complete final checks, explain curing and maintenance requirements, and provide the agreed project documentation.'],
  ];

  const clean = (value, fallback = '') => typeof value === 'string' && value.trim() ? value.trim() : fallback;
  const html = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
  const phoneHref = (value) => clean(value, '+441234567890').replace(/^tel:/i, '');
  const whatsappNumber = (value) => clean(value).replace(/^https?:\/\/(?:www\.)?(?:wa\.me|api\.whatsapp\.com\/send\?phone=)/i, '').replace(/\D/g, '');

  function normalizeBusiness(raw = {}) {
    const areas = (Array.isArray(raw.serviceAreas) ? raw.serviceAreas : Array.isArray(raw.areas) ? raw.areas : [])
      .map((item) => clean(item)).filter(Boolean).slice(0, 12);
    const phone = clean(raw.phoneDisplay || raw.phone, '01234 567 890');
    const tel = phoneHref(raw.phoneLink || raw.phoneHref || raw.phone);
    const whatsapp = whatsappNumber(raw.whatsappLink || raw.whatsapp || tel) || tel.replace(/\D/g, '');
    const rawProjects = Array.isArray(raw.projects) && raw.projects.length ? raw.projects : fallbackProjects;
    const projects = rawProjects.slice(0, 8).map((project, index) => {
      const fallback = fallbackProjects[index % fallbackProjects.length];
      return {
        title: clean(project.title, fallback.title), location: clean(project.location, areas[0] || fallback.location),
        blend: clean(project.blend, fallback.blend), size: clean(project.size, fallback.size),
        image: clean(project.image, fallback.image), copy: clean(project.copy, fallback.copy),
      };
    });
    const rawFinishes = Array.isArray(raw.finishes) && raw.finishes.length ? raw.finishes : fallbackFinishes;
    const finishes = rawFinishes.slice(0, 8).map((finish, index) => ({
      name: clean(finish.name, fallbackFinishes[index % fallbackFinishes.length].name),
      value: clean(finish.value, fallbackFinishes[index % fallbackFinishes.length].value),
      fleck: clean(finish.fleck, fallbackFinishes[index % fallbackFinishes.length].fleck),
      mood: clean(finish.mood, fallbackFinishes[index % fallbackFinishes.length].mood),
    }));
    const rawFaqs = Array.isArray(raw.faqs) && raw.faqs.length ? raw.faqs : fallbackFaqs;
    const faqs = rawFaqs.slice(0, 12).map((item, index) => Array.isArray(item)
      ? [clean(item[0], fallbackFaqs[index % fallbackFaqs.length][0]), clean(item[1], fallbackFaqs[index % fallbackFaqs.length][1])]
      : [clean(item.question, fallbackFaqs[index % fallbackFaqs.length][0]), clean(item.answer, fallbackFaqs[index % fallbackFaqs.length][1])]);
    return {
      name: clean(raw.companyName || raw.name, 'StoneFlow'),
      descriptor: clean(raw.descriptor, 'Resin & Surfacing'), phone, tel,
      email: clean(raw.email, 'hello@stoneflowresin.co.uk'), whatsapp,
      address: clean(raw.address, areas[0] || 'United Kingdom'),
      logoUrl: clean(raw.logoPath || raw.logoUrl),
      areas: areas.length ? areas : [clean(raw.address, 'Essex'), 'East London', 'Kent', 'Hertfordshire'].filter(Boolean),
      projects, finishes, faqs,
    };
  }

  function brand(site, dark = false) {
    const mark = site.logoUrl
      ? `<span class="fs-brand-logo"><img src="${html(site.logoUrl)}" alt="" /></span>`
      : '<span class="fs-brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>';
    return `<a class="fs-brand" href="${pathFor('home')}" aria-label="${html(site.name)} home"${dark ? ' style="color:#fff"' : ''}>${mark}<span class="fs-brand-copy"><strong>${html(site.name)}</strong><small>${html(site.descriptor)}</small></span></a>`;
  }

  function nav(site) {
    const links = [['services','Services'], ['projects','Projects'], ['process','Process'], ['about','About'], ['contact','Contact']];
    return `<header class="fs-header">${brand(site)}<nav class="fs-nav" aria-label="Primary navigation">${links.map(([key,label]) => `<a href="${pathFor(key)}"${routeKey === key ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav><div class="fs-header-actions"><a class="fs-button fs-button--primary" href="${pathFor('contact')}">Request a survey ↗</a><button class="fs-menu-button" type="button" aria-label="Open menu" data-fs-menu>☰</button></div></header><aside class="fs-mobile-menu" data-fs-drawer aria-hidden="true"><div class="fs-mobile-panel"><div class="fs-mobile-top">${brand(site, true)}<button class="fs-mobile-close" type="button" aria-label="Close menu" data-fs-close>×</button></div><nav class="fs-mobile-links">${links.map(([key,label], index) => `<a href="${pathFor(key)}"><span>0${index + 1}</span>${label}<b>↗</b></a>`).join('')}<a href="${pathFor('finishes')}"><span>06</span>Finishes<b>↗</b></a><a href="${pathFor('areas')}"><span>07</span>Areas<b>↗</b></a><a href="${pathFor('faq')}"><span>08</span>FAQ<b>↗</b></a></nav><div class="fs-mobile-contact"><a href="tel:${html(site.tel)}">${html(site.phone)}</a><a class="fs-button fs-button--light" href="${pathFor('contact')}">Request a free survey</a></div></div></aside>`;
  }

  const pageTitles = {
    services: ['Services', 'Resin surfacing, built as a complete system.', 'From the visible aggregate to drainage, edging and the structure beneath it, every part of the surface should work together.'],
    projects: ['Selected work', 'Surfaces designed around the property.', 'Use these project directions as proof of approach: proportion, colour, border and preparation should respond to the real site—not a catalogue template.'],
    process: ['How it is built', 'The finish is the last step, not the whole job.', 'A durable resin surface depends on decisions made before the resin is mixed: levels, structure, water management, edges and access.'],
    finishes: ['Finish studio', 'Choose a direction before choosing a sample.', 'Explore aggregate and border combinations digitally, then confirm the final material in the real outdoor light at survey stage.'],
    about: ['About the approach', 'Good surfacing is mostly invisible work.', 'The goal is not simply a clean photograph on installation day. It is a surface that feels considered because the preparation, drainage and finishing details were resolved properly.'],
    areas: ['Areas covered', 'Local routes. Accountable delivery.', 'A focused service area makes surveys, project planning and site communication more practical than trying to operate as anonymous national volume.'],
    faq: ['Frequently asked', 'Clear answers before the first survey.', 'The right questions are usually about the ground beneath the finish: suitability, drainage, preparation, maintenance and how the project will actually be used.'],
    contact: ['Start a project', 'Give the first conversation useful context.', 'Share the basics of the site and what you want to achieve. The enquiry can be sent directly by WhatsApp, with call and email options available too.'],
  };

  function hero(site, key) {
    const [eyebrow, title, copy] = pageTitles[key];
    return `<section class="fs-hero"><div class="fs-page fs-hero-inner"><div class="fs-hero-copy"><p class="fs-eyebrow">${html(eyebrow)}</p><h1 class="fs-display">${html(title)}</h1><p>${html(copy)}</p></div><aside class="fs-hero-aside"><div><span>Specialism</span><strong>Resin-bound surfacing</strong></div><div><span>Coverage</span><strong>${html(site.areas.slice(0, 2).join(' · '))}</strong></div><div><span>Next step</span><strong><a href="${pathFor('contact')}" style="color:inherit;text-decoration:none">Request a site survey ↗</a></strong></div></aside></div></section>`;
  }

  function sectionHead(eyebrow, title, copy, light = false) {
    return `<div class="fs-section-head${light ? ' fs-section-head--light' : ''}"><p class="fs-eyebrow">${html(eyebrow)}</p><h2 class="fs-h2">${title}</h2>${copy ? `<p class="fs-copy${light ? ' fs-copy--light' : ''}">${html(copy)}</p>` : '<span></span>'}</div>`;
  }

  function cta(site, title = 'Plan the site before choosing the surface.') {
    return `<section class="fs-cta"><div class="fs-page fs-cta-inner"><div><p class="fs-eyebrow">Next step</p><h2 class="fs-h2">${html(title)}</h2></div><div class="fs-cta-actions"><a class="fs-button fs-button--dark" href="${pathFor('contact')}">Request a survey ↗</a><a class="fs-button fs-button--ghost" href="tel:${html(site.tel)}">Call ${html(site.phone)}</a></div></div></section>`;
  }

  function servicesPage(site) {
    return `${hero(site, 'services')}<section class="fs-section"><div class="fs-page">${sectionHead('What can be built', 'One visual language.<br>Different site requirements.', 'The right system depends on the load, existing surface, drainage, access and how the space connects to the property.')}<div class="fs-card-grid">${services.map((service, index) => `<article class="fs-card"><span class="fs-card-number">0${index + 1}</span><h3>${html(service.title)}</h3><p>${html(service.copy)}</p></article>`).join('')}</div></div></section><section class="fs-section fs-section--sand"><div class="fs-page">${sectionHead('What changes between projects', 'Specification before decoration.', 'These are the practical decisions that determine whether a project should be a full build, a suitable overlay, or something else entirely.')}<div>${services.map((service, index) => `<article class="fs-service-detail"><span>0${index + 1}</span><div><h3 class="fs-h3">${html(service.title)}</h3><p>${html(service.copy)}</p><ul class="fs-feature-list">${service.features.map((feature) => `<li>✓ ${html(feature)}</li>`).join('')}</ul></div></article>`).join('')}</div></div></section>${cta(site)}`;
  }

  function projectsPage(site) {
    return `${hero(site, 'projects')}<section class="fs-section fs-section--dark"><div class="fs-page">${sectionHead('Project directions', 'Different properties.<br>Different decisions.', 'Images are used as visual project directions in this preview. A live client site can replace them with verified completed work.', true)}<div class="fs-project-grid">${site.projects.map((project, index) => `<article class="fs-project"><img src="${html(project.image)}" alt="${html(project.title)} in ${html(project.location)}" loading="lazy"/><div class="fs-project-copy"><span>0${index + 1} · ${html(project.blend)}</span><h3>${html(project.title)}</h3><p>${html(project.copy)}</p><div class="fs-project-meta"><b>${html(project.location)}</b><b>${html(project.size)}</b></div></div></article>`).join('')}</div></div></section><section class="fs-section"><div class="fs-page">${sectionHead('What to look for', 'The details that make a frontage feel resolved.', 'A strong project is not only about aggregate colour. The edges, thresholds, drainage, proportions and relationship to the property all matter.')}<div class="fs-card-grid">${[['Levels that feel intentional','Falls and transitions should solve water and access requirements without looking improvised.'],['Borders with a job to do','Edging provides restraint and can visually connect the new surface to brickwork, stone or architectural details.'],['Colour that belongs outside','Aggregate should be judged against the real property in daylight, not chosen from a screen alone.'],['Space planned around use','Parking, bin routes, gates, steps and pedestrian circulation should be understood before final geometry is agreed.'],['Drainage designed early','Channels, outlets and permeable build-ups work best when they are part of the initial specification.'],['Preparation that supports the finish','The decorative layer should not be asked to hide movement, cracking or unsuitable structure beneath it.']].map((item,index)=>`<article class="fs-card"><span class="fs-card-number">0${index+1}</span><h3>${html(item[0])}</h3><p>${html(item[1])}</p></article>`).join('')}</div></div></section>${cta(site, 'Make the next project fit the property, not the template.')}`;
  }

  function processPage(site) {
    return `${hero(site, 'process')}<section class="fs-section fs-section--sand"><div class="fs-page fs-process"><div class="fs-process-intro"><p class="fs-eyebrow">The ${html(site.name)} method</p><h2 class="fs-h2">Six stages.<br>One connected build.</h2><p class="fs-copy">The exact specification changes by site, but the sequence should make the invisible work easy to understand before the decorative finish is installed.</p></div><div class="fs-steps">${processSteps.map((step,index)=>`<article class="fs-step"><span>0${index+1}</span><div><h3 class="fs-h3">${html(step[0])}</h3><p>${html(step[1])}</p></div></article>`).join('')}</div></div></section><section class="fs-section"><div class="fs-page">${sectionHead('Before resin is mixed', 'Four checks that protect the finish.', 'These checks are not a substitute for a site-specific specification, but they explain why preparation deserves as much attention as the decorative layer.')}<div class="fs-values">${[['Movement','Cracks or unstable existing surfaces should be understood rather than simply covered.'],['Water','Falls, channels, outlets and permeable layers should be considered as one drainage strategy.'],['Load','Vehicle use and ground conditions influence the structure needed beneath the finish.'],['Edges','Permanent restraint and clean transitions help protect the surface and complete the visual detail.']].map((item,index)=>`<article class="fs-value"><span>0${index+1}</span><h3>${html(item[0])}</h3><p>${html(item[1])}</p></article>`).join('')}</div></div></section>${cta(site, 'Start with the site conditions, then choose the finish.')}`;
  }

  function aboutPage(site) {
    return `${hero(site, 'about')}<section class="fs-section"><div class="fs-page">${sectionHead('Principles', 'A premium finish should make practical sense.', 'This template keeps the focus on the factors homeowners actually need explained: what is being built, why each layer matters, and how the finished surface fits the property.')}<div class="fs-values">${[['Preparation first','The decorative finish is only as convincing as the base, drainage and edge details supporting it.'],['Property-led design','Colour, geometry and borders should complement the building rather than compete with it.'],['Clear scope','A useful quotation explains what is being removed, built, drained, edged and finished—not just a square-metre price.'],['Practical handover','Curing, cleaning and maintenance guidance should be understood before the project is considered complete.']].map((item,index)=>`<article class="fs-value"><span>0${index+1}</span><h3>${html(item[0])}</h3><p>${html(item[1])}</p></article>`).join('')}</div></div></section><section class="fs-section fs-section--dark"><div class="fs-page">${sectionHead('Why this matters', 'The visible surface is<br>only the final layer.', 'A resin-bound system can look simple once finished. That simplicity is the result of resolving many technical and visual decisions beforehand.', true)}<div class="fs-card-grid">${[['Ground','The formation and sub-base carry the loads.'],['Levels','Falls influence access and water movement.'],['Drainage','The project needs a credible route for water.'],['Edges','Permanent restraint protects and frames the surface.'],['Blend','Aggregate establishes tone and texture.'],['Finish','Mixing and trowelling complete the system.']].map((item,index)=>`<article class="fs-card fs-card--dark"><span class="fs-card-number">0${index+1}</span><h3>${html(item[0])}</h3><p>${html(item[1])}</p></article>`).join('')}</div></div></section>${cta(site, 'Ask better questions before committing to a surface.')}`;
  }

  function areasPage(site) {
    return `${hero(site, 'areas')}<section class="fs-section fs-section--dark"><div class="fs-page">${sectionHead('Survey routes', 'Coverage kept focused.', 'The service-area list is personalized from the business preview data. A live site can expand this into dedicated local landing pages where appropriate.', true)}<div class="fs-area-grid">${site.areas.map((area,index)=>`<article class="fs-area"><span>${String(index+1).padStart(2,'0')}</span><strong>${html(area)}</strong></article>`).join('')}</div></div></section><section class="fs-section"><div class="fs-page">${sectionHead('Outside the list?', 'A postcode is more useful than a guess.', 'Travel boundaries depend on project size, schedule and the exact location. Send the postcode with a short description of the site for a practical answer.')}<div class="fs-contact-line"><span>Primary coverage</span><strong>${html(site.areas.join(' · '))}</strong></div><div class="fs-contact-line"><span>Base / address</span><strong>${html(site.address)}</strong></div></div></section>${cta(site, 'Check your postcode with the project details included.')}`;
  }

  function finishesPage(site) {
    return `${hero(site, 'finishes')}<section class="fs-section"><div class="fs-page">${sectionHead('Interactive direction', 'Tone first.<br>Physical sample second.', 'Use the visualiser to narrow the design direction. Natural aggregate and outdoor lighting mean a screen should never be treated as the final colour approval.')}<div class="fs-finish-layout"><div class="fs-finish-preview"><div class="fs-house"></div><div class="fs-drive" data-fs-drive data-border="charcoal"></div><div class="fs-finish-label"><strong data-fs-finish-name>${html(site.finishes[0].name)}</strong><small data-fs-finish-mood>${html(site.finishes[0].mood)}</small></div></div><div class="fs-finish-controls"><div><p class="fs-control-title">01 — Aggregate blend</p><div class="fs-swatches">${site.finishes.map((finish,index)=>`<button class="fs-swatch${index===0?' is-active':''}" type="button" data-fs-swatch data-value="${html(finish.value)}" data-fleck="${html(finish.fleck)}" data-name="${html(finish.name)}" data-mood="${html(finish.mood)}"><i style="--swatch:${html(finish.value)};--fleck:${html(finish.fleck)}"></i><span><strong>${html(finish.name)}</strong><br><small>${html(finish.mood)}</small></span></button>`).join('')}</div></div><div><p class="fs-control-title">02 — Border detail</p><div class="fs-segments"><button class="is-active" type="button" data-fs-border="charcoal">Charcoal block</button><button type="button" data-fs-border="natural">Natural stone</button><button type="button" data-fs-border="none">No border</button></div></div><p class="fs-copy">Final samples should be assessed outdoors against the real brick, stone, render and surrounding landscape before installation.</p></div></div></div></section>${cta(site, 'Bring a finish direction to the site survey.')}`;
  }

  function faqPage(site) {
    const items = site.faqs.length ? site.faqs : fallbackFaqs;
    return `${hero(site, 'faq')}<section class="fs-section"><div class="fs-page">${sectionHead('Questions worth asking', 'Understand the system<br>before comparing quotes.', 'Clear answers make it easier to compare scope, not just headline price.')}<div class="fs-faq">${items.map((item,index)=>`<article${index===0?' class="is-open"':''}><button type="button" data-fs-faq><span>${String(index+1).padStart(2,'0')}</span><strong>${html(item[0])}</strong><b>⌄</b></button><div class="fs-faq-answer">${html(item[1])}</div></article>`).join('')}</div></div></section>${cta(site, 'Still unsure? Put the site details into one message.')}`;
  }

  function contactPage(site) {
    return `${hero(site, 'contact')}<section class="fs-section"><div class="fs-page fs-contact-grid"><aside class="fs-contact-details"><p class="fs-eyebrow">Contact ${html(site.name)}</p><h2 class="fs-h2">One useful brief.<br>Three ways to respond.</h2><p class="fs-copy">The form prepares a WhatsApp message in your browser. Nothing is submitted to a separate form database by this preview.</p><div><a class="fs-contact-line" href="tel:${html(site.tel)}"><span>Call</span><strong>${html(site.phone)}</strong></a><a class="fs-contact-line" href="mailto:${html(site.email)}"><span>Email</span><strong>${html(site.email)}</strong></a><div class="fs-contact-line"><span>Coverage</span><strong>${html(site.areas.slice(0,4).join(' · '))}</strong></div></div></aside><form class="fs-form" data-fs-form><div class="fs-form-grid"><div class="fs-field"><label for="fs-name">Your name</label><input id="fs-name" name="name" required autocomplete="name" /></div><div class="fs-field"><label for="fs-phone">Phone number</label><input id="fs-phone" name="phone" required autocomplete="tel" /></div><div class="fs-field"><label for="fs-postcode">Property postcode</label><input id="fs-postcode" name="postcode" required /></div><div class="fs-field"><label for="fs-project">Project type</label><select id="fs-project" name="project"><option>Resin driveway</option><option>Resin patio</option><option>Paths and access</option><option>Commercial surfacing</option><option>Repair / resurfacing assessment</option></select></div><div class="fs-field"><label for="fs-size">Approximate area</label><input id="fs-size" name="size" placeholder="e.g. 70 m² or space for 3 cars" /></div><div class="fs-field"><label for="fs-timing">Preferred timing</label><select id="fs-timing" name="timing"><option>As soon as practical</option><option>Within 1–3 months</option><option>Within 3–6 months</option><option>Researching for later</option></select></div><div class="fs-field fs-field--full"><label for="fs-notes">Anything important about the site?</label><textarea id="fs-notes" name="notes" placeholder="Current surface, drainage concerns, access, preferred colours or any other useful context…"></textarea></div></div><div class="fs-form-actions"><button class="fs-button fs-button--dark" type="submit">Send by WhatsApp ↗</button><a class="fs-button fs-button--ghost" href="mailto:${html(site.email)}">Use email instead</a></div><p class="fs-form-note">This preview creates the WhatsApp message locally and opens WhatsApp for you to review before sending.</p></form></div></section>`;
  }

  function footer(site) {
    return `<footer class="fs-footer"><div class="fs-page"><div class="fs-footer-top">${brand(site, true)}<div class="fs-footer-column"><span>Explore</span><a href="${pathFor('services')}">Services</a><a href="${pathFor('projects')}">Projects</a><a href="${pathFor('finishes')}">Finishes</a><a href="${pathFor('process')}">Process</a></div><div class="fs-footer-column"><span>Company</span><a href="${pathFor('about')}">About</a><a href="${pathFor('areas')}">Areas covered</a><a href="${pathFor('faq')}">FAQ</a><a href="${pathFor('contact')}">Contact</a></div><div class="fs-footer-column"><span>Contact</span><a href="tel:${html(site.tel)}">${html(site.phone)}</a><a href="mailto:${html(site.email)}">${html(site.email)}</a>${site.areas.slice(0,3).map((area)=>`<span style="margin:0;color:rgba(255,255,255,.48);text-transform:none;letter-spacing:0">${html(area)}</span>`).join('')}</div></div><div class="fs-footer-legal"><span>© ${new Date().getFullYear()} ${html(site.name)}. Preview concept using available business information.</span><a href="${pathFor('home')}" style="color:inherit;text-decoration:none">Back to homepage ↑</a></div></div></footer><div class="fs-mobile-actions"><a href="tel:${html(site.tel)}">Call</a><a href="${pathFor('contact')}">Free survey ↗</a></div>`;
  }

  function bindSubpage(site) {
    const menu = document.querySelector('[data-fs-drawer]');
    const open = document.querySelector('[data-fs-menu]');
    const close = document.querySelector('[data-fs-close]');
    const setMenu = (state) => {
      if (!menu) return;
      menu.classList.toggle('is-open', state);
      menu.setAttribute('aria-hidden', state ? 'false' : 'true');
      document.body.style.overflow = state ? 'hidden' : '';
    };
    open?.addEventListener('click', () => setMenu(true));
    close?.addEventListener('click', () => setMenu(false));
    menu?.addEventListener('click', (event) => { if (event.target === menu) setMenu(false); });

    document.querySelectorAll('[data-fs-faq]').forEach((button) => button.addEventListener('click', () => {
      const article = button.closest('article');
      article?.classList.toggle('is-open');
    }));

    const drive = document.querySelector('[data-fs-drive]');
    document.querySelectorAll('[data-fs-swatch]').forEach((button) => button.addEventListener('click', () => {
      document.querySelectorAll('[data-fs-swatch]').forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');
      if (drive) {
        drive.style.setProperty('--finish', button.dataset.value || '#aaa89d');
        drive.style.setProperty('--fleck', button.dataset.fleck || '#e1ddd2');
      }
      const name = document.querySelector('[data-fs-finish-name]');
      const mood = document.querySelector('[data-fs-finish-mood]');
      if (name) name.textContent = button.dataset.name || '';
      if (mood) mood.textContent = button.dataset.mood || '';
    }));
    document.querySelectorAll('[data-fs-border]').forEach((button) => button.addEventListener('click', () => {
      document.querySelectorAll('[data-fs-border]').forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');
      if (drive) drive.dataset.border = button.dataset.fsBorder || 'charcoal';
    }));

    document.querySelector('[data-fs-form]')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const message = [
        `Hello ${site.name}, I would like to request a site survey.`,
        `Project: ${form.get('project') || 'Not supplied'}`,
        `Postcode: ${form.get('postcode') || 'Not supplied'}`,
        `Approx. size: ${form.get('size') || 'Not supplied'}`,
        `Timing: ${form.get('timing') || 'Not supplied'}`,
        `Name: ${form.get('name') || 'Not supplied'}`,
        `Phone: ${form.get('phone') || 'Not supplied'}`,
        `Notes: ${form.get('notes') || 'None'}`,
      ].join('\n');
      window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    });
  }

  function renderSubpage(site) {
    const renderers = { services: servicesPage, projects: projectsPage, process: processPage, finishes: finishesPage, about: aboutPage, areas: areasPage, faq: faqPage, contact: contactPage };
    const mount = document.getElementById('resin-full-site') || document.body.appendChild(Object.assign(document.createElement('div'), { id: 'resin-full-site' }));
    mount.innerHTML = `${nav(site)}<main>${(renderers[routeKey] || servicesPage)(site)}</main>${footer(site)}`;
    document.title = `${site.name} | ${pageTitles[routeKey][0]}`;
    bindSubpage(site);
  }

  function enhanceHome(site) {
    document.documentElement.dataset.resinFullSite = 'true';
    const desktopLinks = [...document.querySelectorAll('.site-header .desktop-nav a')];
    const desktopMap = [['services','Services'], ['projects','Projects'], ['process','Process'], ['about','About']];
    desktopLinks.slice(0, 4).forEach((link, index) => {
      const target = desktopMap[index];
      if (!target) return;
      link.href = pathFor(target[0]);
      link.textContent = target[1];
    });
    document.querySelectorAll('.site-header .brand, .footer .brand').forEach((link) => { link.href = pathFor('home'); });

    const footerExplore = [...document.querySelectorAll('.footer__lower > div')].find((element) => element.querySelector('span')?.textContent.trim() === 'Explore');
    if (footerExplore) {
      footerExplore.innerHTML = `<span>Explore</span><a href="${pathFor('services')}">Services</a><a href="${pathFor('projects')}">Projects</a><a href="${pathFor('about')}">About</a><a href="${pathFor('contact')}">Contact</a>`;
    }

    const menuHandler = (event) => {
      const button = event.target.closest('.mobile-menu nav button');
      if (!button) return;
      const label = button.textContent.toLowerCase();
      const target = label.includes('project') ? 'projects' : label.includes('finish') ? 'finishes' : label.includes('process') ? 'process' : label.includes('planner') ? 'contact' : null;
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();
      window.location.href = pathFor(target);
    };
    document.addEventListener('click', menuHandler, true);

    const observer = new MutationObserver(() => {
      const menu = document.querySelector('.mobile-menu');
      if (menu) menu.setAttribute('data-full-site-nav', 'true');
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const projectHeroLink = [...document.querySelectorAll('.hero a')].find((link) => link.textContent.toLowerCase().includes('explore projects'));
    if (projectHeroLink) projectHeroLink.href = pathFor('projects');
  }

  function waitForRuntime() {
    let attempts = 0;
    const tick = () => {
      const raw = globalThis.__PLATRIK_RESIN__;
      if (raw && typeof raw === 'object') {
        const site = normalizeBusiness(raw);
        if (routeKey === 'home') {
          const hasHome = document.querySelector('.site-header') && document.querySelector('.hero');
          if (!hasHome && attempts < 120) { attempts += 1; setTimeout(tick, 50); return; }
          enhanceHome(site);
        } else {
          renderSubpage(site);
        }
        return;
      }
      if (attempts++ < 160) setTimeout(tick, 50);
    };
    tick();
  }

  waitForRuntime();
})();

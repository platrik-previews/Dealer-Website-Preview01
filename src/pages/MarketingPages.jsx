import { useMemo, useState } from 'react';
import { business } from '../config/business';
import { SiteShell, SmartLink } from '../components/SiteShell';

function PageHero({ eyebrow, title, accent, intro, children, aside }) {
  return (
    <section className="public-page-hero">
      <div className="public-page-hero__copy reveal">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}<br /><em>{accent}</em></h1>
        <p>{intro}</p>
        {children && <div className="button-row">{children}</div>}
      </div>
      {aside && <div className="public-page-hero__aside reveal">{aside}</div>}
    </section>
  );
}

function SectionHeading({ eyebrow, title, intro }) {
  return (
    <div className="public-section-heading reveal">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
  );
}

function NumberedSteps({ items }) {
  return (
    <div className="numbered-steps">
      {items.map((item, index) => (
        <article key={item.title} className="numbered-step reveal">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <div><h3>{item.title}</h3><p>{item.text}</p></div>
        </article>
      ))}
    </div>
  );
}

function ContactRail() {
  return (
    <div className="contact-rail reveal">
      <div><span>Call</span><a href={business.contact.phoneLink}>{business.contact.phoneDisplay}</a></div>
      {business.contact.email && <div><span>Email</span><a href={`mailto:${business.contact.email}`}>{business.contact.email}</a></div>}
      <div><span>Visit</span><a href={business.contact.mapsLink} target="_blank" rel="noreferrer">{business.contact.address}</a></div>
    </div>
  );
}

function buildEnquiryUrl(subject, rows) {
  const body = rows.filter(([, value]) => String(value || '').trim()).map(([label, value]) => `${label}: ${value}`).join('\n');
  if (business.contact.email) {
    return `mailto:${business.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  if (business.contact.whatsappLink?.startsWith('http')) {
    return `${business.contact.whatsappLink}${business.contact.whatsappLink.includes('?') ? '&' : '?'}text=${encodeURIComponent(`${subject}\n\n${body}`)}`;
  }
  return business.contact.phoneLink;
}

function GeneralEnquiryForm({ kind = 'General enquiry', compact = false }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    window.location.href = buildEnquiryUrl(`${kind} — ${business.identity.displayName}`, [
      ['Name', form.name], ['Phone', form.phone], ['Email', form.email], ['Message', form.message],
    ]);
  };

  return (
    <form className={`public-form ${compact ? 'public-form--compact' : ''}`} onSubmit={submit}>
      <div className="public-form__grid">
        <label><span>Name</span><input required value={form.name} onChange={update('name')} autoComplete="name" placeholder="Your name" /></label>
        <label><span>Phone</span><input required value={form.phone} onChange={update('phone')} autoComplete="tel" inputMode="tel" placeholder="Best contact number" /></label>
        <label><span>Email</span><input value={form.email} onChange={update('email')} autoComplete="email" type="email" placeholder="name@example.com" /></label>
        <label className="public-form__wide"><span>How can we help?</span><textarea required value={form.message} onChange={update('message')} rows="5" placeholder="Tell us what you are looking for" /></label>
      </div>
      <div className="public-form__footer"><small>Submitting opens your email or messaging app so you stay in control of what is sent.</small><button className="button button--primary" type="submit">Send enquiry ↗</button></div>
    </form>
  );
}

function FinancePlanner() {
  const [price, setPrice] = useState(18000);
  const [deposit, setDeposit] = useState(2500);
  const [term, setTerm] = useState(48);
  const [apr, setApr] = useState(9.9);

  const result = useMemo(() => {
    const principal = Math.max(Number(price) - Number(deposit), 0);
    const months = Math.max(Number(term), 1);
    const monthlyRate = Math.max(Number(apr), 0) / 100 / 12;
    const monthly = monthlyRate === 0
      ? principal / months
      : principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
    const total = monthly * months + Number(deposit || 0);
    return { principal, monthly: Number.isFinite(monthly) ? monthly : 0, total: Number.isFinite(total) ? total : 0 };
  }, [price, deposit, term, apr]);

  const money = (value) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: business.regional.currency, maximumFractionDigits: 0 }).format(value || 0);

  return (
    <div className="finance-planner reveal">
      <div className="finance-planner__controls">
        <p className="eyebrow">Illustrative budget planner</p>
        <h2>Shape a monthly budget before you enquire.</h2>
        <div className="planner-grid">
          <label><span>Vehicle price</span><div className="money-input"><b>{business.regional.currencySymbol}</b><input type="number" min="0" step="250" value={price} onChange={(event) => setPrice(event.target.value)} /></div></label>
          <label><span>Deposit</span><div className="money-input"><b>{business.regional.currencySymbol}</b><input type="number" min="0" step="250" value={deposit} onChange={(event) => setDeposit(event.target.value)} /></div></label>
          <label><span>Term</span><select value={term} onChange={(event) => setTerm(event.target.value)}><option value="24">24 months</option><option value="36">36 months</option><option value="48">48 months</option><option value="60">60 months</option></select></label>
          <label><span>Example APR</span><div className="money-input money-input--suffix"><input type="number" min="0" max="50" step="0.1" value={apr} onChange={(event) => setApr(event.target.value)} /><b>%</b></div></label>
        </div>
      </div>
      <div className="finance-planner__result" aria-live="polite">
        <span>Illustrative monthly payment</span>
        <strong>{money(result.monthly)}</strong>
        <div><small>Amount financed</small><b>{money(result.principal)}</b></div>
        <div><small>Illustrative total payable</small><b>{money(result.total)}</b></div>
        <p>This is a planning illustration, not a finance quote or offer. Actual rates, fees, eligibility and terms depend on the provider and applicant.</p>
        <a className="button button--primary" href={business.contact.phoneLink}>Discuss finance ↗</a>
      </div>
    </div>
  );
}

function ValuationForm() {
  const [form, setForm] = useState({ name: '', phone: '', registration: '', mileage: '', vehicle: '', condition: 'Good', notes: '' });
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    window.location.href = buildEnquiryUrl(`Part-exchange valuation — ${business.identity.displayName}`, [
      ['Name', form.name], ['Phone', form.phone], ['Registration', form.registration], ['Mileage', form.mileage],
      ['Vehicle', form.vehicle], ['Condition', form.condition], ['Notes', form.notes],
    ]);
  };

  return (
    <form className="public-form valuation-form reveal" onSubmit={submit}>
      <div className="public-form__grid">
        <label><span>Your name</span><input required value={form.name} onChange={update('name')} autoComplete="name" placeholder="Your name" /></label>
        <label><span>Phone</span><input required value={form.phone} onChange={update('phone')} autoComplete="tel" inputMode="tel" placeholder="Best contact number" /></label>
        <label><span>Registration</span><input required value={form.registration} onChange={update('registration')} autoCapitalize="characters" placeholder="AB12 CDE" /></label>
        <label><span>Mileage</span><input required value={form.mileage} onChange={update('mileage')} inputMode="numeric" placeholder="e.g. 42,000" /></label>
        <label><span>Make & model</span><input required value={form.vehicle} onChange={update('vehicle')} placeholder="e.g. BMW 320d M Sport" /></label>
        <label><span>Condition</span><select value={form.condition} onChange={update('condition')}><option>Excellent</option><option>Good</option><option>Fair</option><option>Needs attention</option></select></label>
        <label className="public-form__wide"><span>Anything we should know?</span><textarea value={form.notes} onChange={update('notes')} rows="4" placeholder="Service history, options, cosmetic condition or anything else useful" /></label>
      </div>
      <div className="public-form__footer"><small>No obligation. The dealership can confirm a valuation after reviewing the vehicle details.</small><button className="button button--primary" type="submit">Request valuation ↗</button></div>
    </form>
  );
}

export function AboutPage() {
  const name = business.identity.displayName;
  return (
    <SiteShell>
      <PageHero
        eyebrow="About the dealership"
        title="Straightforward cars."
        accent="Human service."
        intro={`${name} is built around a simple idea: buyers should be able to understand the car, the process and the next step without unnecessary pressure.`}
        aside={<><span className="public-kicker">Independent dealership</span><strong>{business.contact.address}</strong><p>Direct contact, carefully presented vehicles and support before and after the enquiry.</p></>}
      >
        <SmartLink href="/inventory" className="button button--primary">Browse current stock</SmartLink>
        <SmartLink href="/contact" className="button button--ghost">Speak with the team</SmartLink>
      </PageHero>

      <section className="public-section public-section--split">
        <SectionHeading eyebrow="What matters here" title="Confidence comes from the details." intro="A good dealership website should make the buying process easier, not noisier." />
        <div className="principle-grid">
          {[
            ['Clear', 'Useful vehicle information presented without making buyers dig for the basics.'],
            ['Direct', 'Phone, messaging and enquiry routes that connect buyers with the dealership quickly.'],
            ['Considered', 'Stock selected and presented with a focus on condition, fit and value.'],
            ['Practical', 'Part-exchange, finance conversations and vehicle sourcing kept easy to understand.'],
          ].map(([title, text]) => <article key={title} className="principle-card reveal"><span>↗</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="public-section public-section--soft">
        <SectionHeading eyebrow="Buying journey" title="From first look to next drive." />
        <NumberedSteps items={[
          { title: 'Browse with context', text: 'Explore current stock, key specifications and vehicle details at your own pace.' },
          { title: 'Ask direct questions', text: 'Call or message the dealership about history, condition, availability, finance or part exchange.' },
          { title: 'Arrange the next step', text: 'Book a viewing, discuss your current vehicle and confirm what is needed before travelling.' },
        ]} />
      </section>

      <section className="public-cta-band reveal"><div><p className="eyebrow">Ready to look around?</p><h2>Start with the cars.</h2></div><div className="button-row"><SmartLink href="/inventory" className="button button--primary">View stock</SmartLink><SmartLink href="/contact" className="button button--ghost">Contact us</SmartLink></div></section>
    </SiteShell>
  );
}

export function ServicesPage() {
  const serviceCards = [
    ...business.services.map((service) => ({ ...service, href: service.title.toLowerCase().includes('finance') ? '/finance' : service.title.toLowerCase().includes('part') ? '/part-exchange' : '/contact' })),
    { number: '04', title: 'Sell your car', text: 'Share the essentials about your vehicle and start a direct conversation about a potential purchase.', href: '/part-exchange' },
    { number: '05', title: 'Vehicle enquiries', text: 'Ask about condition, history, specification, availability or arranging a viewing before you travel.', href: '/contact' },
    { number: '06', title: 'After-enquiry support', text: 'Keep the next steps clear with direct contact and practical guidance around the vehicle you are considering.', href: '/faq' },
  ];

  return (
    <SiteShell>
      <PageHero eyebrow="Dealership services" title="Useful support." accent="No unnecessary theatre." intro="Everything around the car should make the decision simpler: finding the right vehicle, understanding options and arranging the next step.">
        <SmartLink href="/inventory" className="button button--primary">Browse stock</SmartLink>
        <SmartLink href="/contact" className="button button--ghost">Ask a question</SmartLink>
      </PageHero>
      <section className="public-section">
        <div className="service-page-grid">
          {serviceCards.map((service) => (
            <SmartLink key={`${service.number}-${service.title}`} href={service.href} className="service-page-card reveal">
              <span>{service.number}</span><h2>{service.title}</h2><p>{service.text}</p><strong>Explore ↗</strong>
            </SmartLink>
          ))}
        </div>
      </section>
      <section className="public-section public-section--soft">
        <SectionHeading eyebrow="Need something specific?" title="Tell the dealership what you are trying to do." intro="A direct enquiry is often the fastest route when your question depends on a particular vehicle, budget or trade-in." />
        <GeneralEnquiryForm kind="Service enquiry" />
      </section>
    </SiteShell>
  );
}

export function FinancePage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Finance support"
        title="Plan the car."
        accent="Then the numbers."
        intro="Use the planner to explore a rough monthly budget, then speak with the dealership about any finance options or introductions available for the vehicle you want."
        aside={<><span className="public-kicker">Before applying</span><strong>Budget first.</strong><p>Consider deposit, term, running costs and a comfortable monthly figure before discussing a specific agreement.</p></>}
      >
        <a className="button button--primary" href={business.contact.phoneLink}>Call about finance</a>
        <SmartLink href="/inventory" className="button button--ghost">Choose a vehicle</SmartLink>
      </PageHero>
      <section className="public-section"><FinancePlanner /></section>
      <section className="public-section public-section--soft">
        <SectionHeading eyebrow="How to approach it" title="Keep the finance conversation practical." />
        <NumberedSteps items={[
          { title: 'Choose the vehicle', text: 'Start with a car that fits your needs and overall budget rather than only targeting a monthly figure.' },
          { title: 'Set a comfortable deposit', text: 'Decide what you can put down without stretching cash needed for insurance, tax, servicing or other costs.' },
          { title: 'Discuss actual options', text: 'Ask the dealership what finance routes may be available and review the provider’s full terms before committing.' },
        ]} />
      </section>
      <section className="disclosure-card reveal"><strong>Important</strong><p>Finance availability, rates and eligibility vary. Any calculator shown here is illustrative only and does not constitute financial advice, a quotation, an approval or an offer of credit.</p></section>
    </SiteShell>
  );
}

export function PartExchangePage() {
  return (
    <SiteShell>
      <PageHero eyebrow="Part exchange / sell your car" title="Your current car" accent="can be the next step." intro="Send the key details first. The dealership can review what you have, ask the right follow-up questions and discuss whether a part exchange or direct purchase makes sense.">
        <a className="button button--primary" href="#valuation">Start valuation</a>
        <SmartLink href="/inventory" className="button button--ghost">See what to replace it with</SmartLink>
      </PageHero>
      <section className="public-section public-section--soft">
        <SectionHeading eyebrow="Simple process" title="Give enough detail to start properly." />
        <NumberedSteps items={[
          { title: 'Share the essentials', text: 'Registration, mileage, model, general condition and any useful notes about history or specification.' },
          { title: 'Review and follow-up', text: 'The dealership can ask for photos, service information or a viewing if more detail is needed.' },
          { title: 'Discuss the value', text: 'If the vehicle is suitable, discuss a part-exchange figure or direct purchase alongside your next-car options.' },
        ]} />
      </section>
      <section className="public-section" id="valuation">
        <SectionHeading eyebrow="Vehicle valuation" title="Tell us what you have." intro="This starts the conversation; the final figure can depend on inspection, history, specification and current market conditions." />
        <ValuationForm />
      </section>
    </SiteShell>
  );
}

export function ContactPage() {
  return (
    <SiteShell>
      <PageHero eyebrow="Contact" title="A direct route" accent="to the dealership." intro="Ask about a car, arrange a viewing, discuss a trade-in or get clarity before making the journey.">
        <a className="button button--primary" href={business.contact.phoneLink}>Call {business.contact.phoneDisplay}</a>
        {business.contact.whatsappLink?.startsWith('http') && <a className="button button--ghost" href={business.contact.whatsappLink}>WhatsApp</a>}
      </PageHero>
      <section className="public-section"><ContactRail /></section>
      <section className="contact-page-grid public-section public-section--soft">
        <div className="contact-page-copy reveal">
          <p className="eyebrow">Opening hours</p>
          <h2>Plan your visit.</h2>
          <div className="hours-list">{business.openingHours.map(([day, hours]) => <div key={day}><span>{day}</span><strong>{hours}</strong></div>)}</div>
          <a className="text-link" href={business.contact.mapsLink} target="_blank" rel="noreferrer">Open directions <span>↗</span></a>
        </div>
        <div className="contact-page-form reveal"><p className="eyebrow">Send an enquiry</p><h2>What do you need help with?</h2><GeneralEnquiryForm compact /></div>
      </section>
      {(business.social.instagram || business.social.facebook) && <section className="social-strip reveal"><span>Follow the dealership</span><div>{business.social.instagram && <a href={business.social.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>}{business.social.facebook && <a href={business.social.facebook} target="_blank" rel="noreferrer">Facebook ↗</a>}</div></section>}
    </SiteShell>
  );
}

export function FaqPage() {
  const items = [
    ['How do I check whether a vehicle is still available?', 'Open the vehicle page and contact the dealership directly. Stock can change quickly, so confirming before travelling is recommended.'],
    ['Can I discuss part exchange?', 'Yes. Use the part-exchange page to send basic vehicle details, or contact the dealership directly to start the conversation.'],
    ['Can I ask about finance?', 'Yes. The finance page includes an illustrative planner and contact routes for discussing any finance options or introductions the dealership may offer.'],
    ['Can I arrange a viewing or test drive?', 'Contact the dealership with the vehicle you are interested in and your preferred timing so availability can be confirmed.'],
    ['Where can I find vehicle specification and mileage?', 'Each vehicle detail page presents the main specification, mileage, status, images and description supplied for that vehicle.'],
    ['What if the exact car I want is not listed?', 'Use the services or contact page to ask about vehicle sourcing or suitable alternatives.'],
  ];

  return (
    <SiteShell>
      <PageHero eyebrow="Frequently asked questions" title="Useful answers" accent="before you enquire." intro="The common questions buyers ask before travelling, part-exchanging or choosing a vehicle." />
      <section className="public-section faq-list">
        {items.map(([question, answer], index) => <details key={question} className="faq-item reveal"><summary><span>{String(index + 1).padStart(2, '0')}</span><strong>{question}</strong><i>+</i></summary><p>{answer}</p></details>)}
      </section>
      <section className="public-cta-band reveal"><div><p className="eyebrow">Still need an answer?</p><h2>Ask the dealership directly.</h2></div><SmartLink href="/contact" className="button button--primary">Contact us</SmartLink></section>
    </SiteShell>
  );
}

export function NotFoundPage() {
  return (
    <SiteShell>
      <section className="not-found-page">
        <span>404</span><p className="eyebrow">Page not found</p><h1>This road ends here.</h1><p>The page you tried to open is not part of this dealership website.</p>
        <div className="button-row"><SmartLink href="/" className="button button--primary">Return home</SmartLink><SmartLink href="/inventory" className="button button--ghost">Browse stock</SmartLink></div>
      </section>
    </SiteShell>
  );
}

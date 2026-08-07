import { useEffect } from 'react';
import { business } from '../config/business';
import { Header, Mark, SmartLink } from './Navigation';

export { Mark, SmartLink } from './Navigation';

export function Footer() {
  const emailHref = business.contact.email ? `mailto:${business.contact.email}` : business.contact.phoneLink;
  return (
    <footer className="site-footer" id="contact">
      <div className="site-footer__lead reveal">
        <p className="eyebrow">{business.footer.eyebrow}</p>
        <h2>{business.footer.heading}</h2>
        <div className="button-row">
          <a className="button button--primary" href={business.contact.phoneLink}>Call {business.contact.phoneDisplay}</a>
          <a className="button button--ghost" href={emailHref}>{business.contact.email ? business.footer.emailButton : 'Make an enquiry'}</a>
        </div>
      </div>
      <div className="site-footer__grid">
        <div><Mark /><p>{business.footer.description}</p></div>
        <div><strong>Visit</strong><a href={business.contact.mapsLink} target="_blank" rel="noreferrer">{business.contact.address}</a></div>
        <div><strong>Hours</strong>{business.openingHours.map(([day, hours]) => <span key={day}>{day}<small>{hours}</small></span>)}</div>
        <div className="footer-link-stack"><strong>Explore</strong><SmartLink href="/inventory">Current stock</SmartLink><SmartLink href="/about">About us</SmartLink><SmartLink href="/services">Services</SmartLink><SmartLink href="/finance">Finance</SmartLink><SmartLink href="/part-exchange">Part exchange</SmartLink><SmartLink href="/contact">Contact</SmartLink><SmartLink href="/faq">FAQ</SmartLink><SmartLink href="/dealer-login">Dealer login</SmartLink></div>
      </div>
      <div className="site-footer__bottom"><span>© {new Date().getFullYear()} {business.identity.legalName}</span><span>{business.footer.creditLine}</span></div>
    </footer>
  );
}

export function SiteShell({ children }) {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal:not(.is-visible)');
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  });

  return <><Header /><main>{children}</main><Footer /></>;
}

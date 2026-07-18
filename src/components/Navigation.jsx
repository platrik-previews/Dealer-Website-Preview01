import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { business } from '../config/business';
import { navigate, usePathname } from '../hooks/usePathname';

export const SmartLink = forwardRef(function SmartLink({ href, className, children, onClick, ...props }, ref) {
  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!href?.startsWith('/')) return;
    event.preventDefault();
    const [pathname, hash] = href.split('#');
    navigate(`${pathname || '/'}${hash ? `#${hash}` : ''}`);
    if (hash) {
      window.setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }), 60);
    }
  };

  return <a ref={ref} href={href} className={className} onClick={handleClick} {...props}>{children}</a>;
});

export function Mark({ compact = false }) {
  const { identity } = business;

  if (identity.logoImage) {
    return (
      <div className={`brand-mark brand-mark--image ${compact ? 'brand-mark--compact' : ''}`} aria-label={identity.displayName}>
        <img src={identity.logoImage} alt={identity.logoAlt || identity.displayName} />
      </div>
    );
  }

  return (
    <div className={`brand-mark ${compact ? 'brand-mark--compact' : ''}`} aria-label={identity.displayName}>
      <span className="brand-mark__symbol" aria-hidden="true">
        <i /><i /><i />
      </span>
      {!compact && <span><strong>{identity.logoLine1}</strong><small>{identity.logoLine2}</small></span>}
    </div>
  );
}

function getRouteActiveHref(pathname, hash) {
  if (pathname === '/inventory' || pathname.startsWith('/vehicle/')) return '/inventory';
  if (pathname !== '/') return '';
  return hash ? `/${hash}` : '/';
}

export function Header() {
  const { pathname, hash } = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState(() => getRouteActiveHref(pathname, hash));
  const [indicator, setIndicator] = useState({ x: 0, width: 0, ready: false });
  const desktopNavRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setActiveHref(getRouteActiveHref(pathname, hash));
    setOpen(false);
  }, [pathname, hash]);

  useEffect(() => {
    if (pathname !== '/') return undefined;

    const sections = business.navigation
      .map((item, index) => {
        const sectionId = item.sectionId || item.href.match(/#(.+)$/)?.[1];
        const element = sectionId ? document.getElementById(sectionId) : null;
        return element ? { item, index, element } : null;
      })
      .filter(Boolean);

    if (!sections.length) return undefined;

    let frame = 0;
    let previousScrollY = window.scrollY;
    let previousDirection = 1;

    const updateActiveSection = () => {
      frame = 0;
      const scrollY = window.scrollY;
      const viewportHeight = Math.max(window.innerHeight, 1);
      const delta = scrollY - previousScrollY;
      const direction = delta === 0 ? previousDirection : delta > 0 ? 1 : -1;
      previousScrollY = scrollY;
      previousDirection = direction;

      const visibleSections = sections
        .map((section) => ({ ...section, rect: section.element.getBoundingClientRect() }))
        .filter(({ rect }) => rect.top < viewportHeight && rect.bottom > 0);

      if (!visibleSections.length) {
        const firstSection = sections[0].element.getBoundingClientRect();
        if (firstSection.top >= viewportHeight || scrollY <= 2) setActiveHref('/');
        return;
      }

      const activeSection = direction > 0
        ? visibleSections[visibleSections.length - 1]
        : visibleSections[0];

      setActiveHref(activeSection.item.href);
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useLayoutEffect(() => {
    const nav = desktopNavRef.current;
    if (!nav) return undefined;

    const updateIndicator = () => {
      const activeLink = nav.querySelector('a.is-active');
      if (!activeLink) {
        setIndicator((current) => ({ ...current, ready: false }));
        return;
      }
      setIndicator({ x: activeLink.offsetLeft, width: activeLink.offsetWidth, ready: true });
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator, { passive: true });
    const fontReady = document.fonts?.ready;
    fontReady?.then(updateIndicator).catch(() => {});
    return () => {
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activeHref]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''} ${open ? 'site-header--menu-open' : ''}`}>
        <SmartLink href="/" className="site-header__brand nav-island" onClick={closeMenu} aria-label={`${business.identity.displayName} home`}>
          <Mark />
        </SmartLink>

        <nav
          ref={desktopNavRef}
          className="site-nav site-nav--desktop nav-island"
          aria-label="Primary navigation"
          style={{
            '--nav-indicator-x': `${indicator.x}px`,
            '--nav-indicator-width': `${indicator.width}px`,
            '--nav-indicator-opacity': indicator.ready ? 1 : 0,
          }}
        >
          <span className="site-nav__indicator" aria-hidden="true" />
          {business.navigation.map((item) => (
            <SmartLink
              key={item.label}
              href={item.href}
              className={activeHref === item.href ? 'is-active' : ''}
              aria-current={activeHref === item.href ? 'page' : undefined}
            >
              {item.label}
            </SmartLink>
          ))}
        </nav>

        <a className="header-cta nav-island" href={business.contact.phoneLink}>
          <span className="header-cta__copy"><small>Speak with us</small><strong>Call now</strong></span>
          <span className="header-cta__arrow" aria-hidden="true">↗</span>
        </a>

        <button
          className="menu-button nav-island"
          type="button"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="menu-button__label">{open ? 'Close' : 'Menu'}</span>
          <span className="menu-button__icon" aria-hidden="true"><i /><i /></span>
        </button>
      </header>

      <div id="mobile-navigation" className={`mobile-nav ${open ? 'mobile-nav--open' : ''}`} aria-hidden={!open}>
        <div className="mobile-nav__ambient" aria-hidden="true">DRIVE</div>
        <nav className="mobile-nav__links" aria-label="Mobile navigation">
          {business.navigation.map((item, index) => (
            <SmartLink
              key={item.label}
              href={item.href}
              onClick={closeMenu}
              className={activeHref === item.href ? 'is-active' : ''}
              aria-current={activeHref === item.href ? 'page' : undefined}
              style={{ '--mobile-link-index': index }}
              tabIndex={open ? 0 : -1}
            >
              <small>{String(index + 1).padStart(2, '0')}</small>
              <strong>{item.label}</strong>
              <span aria-hidden="true">↗</span>
            </SmartLink>
          ))}
        </nav>
        <div className="mobile-nav__actions">
          <a href={business.contact.phoneLink} tabIndex={open ? 0 : -1}><span>Call dealership</span><strong>{business.contact.phoneDisplay}</strong></a>
          <SmartLink href="/dealer-login" onClick={closeMenu} tabIndex={open ? 0 : -1}>Dealer login <span aria-hidden="true">↗</span></SmartLink>
        </div>
      </div>
    </>
  );
}

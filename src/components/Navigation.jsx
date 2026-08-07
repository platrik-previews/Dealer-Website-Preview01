import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { business } from '../config/business';
import { navigate, toPublicPath, usePathname } from '../hooks/usePathname';

const PRIMARY_NAVIGATION = [
  { label: 'Home', href: '/' },
  { label: 'Stock', href: '/inventory' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Finance', href: '/finance' },
  { label: 'Sell / PX', href: '/part-exchange' },
  { label: 'Contact', href: '/contact' },
];

export const SmartLink = forwardRef(function SmartLink({ href, className, children, onClick, ...props }, ref) {
  const publicHref = toPublicPath(href);
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

  return <a ref={ref} href={publicHref} className={className} onClick={handleClick} {...props}>{children}</a>;
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
      <span className="brand-mark__symbol" aria-hidden="true"><i /><i /><i /></span>
      {!compact && <span><strong>{identity.logoLine1}</strong><small>{identity.logoLine2}</small></span>}
    </div>
  );
}

function getRouteActiveHref(pathname) {
  if (pathname === '/inventory' || pathname.startsWith('/vehicle/')) return '/inventory';
  if (pathname === '/sell-your-car') return '/part-exchange';
  return PRIMARY_NAVIGATION.some((item) => item.href === pathname) ? pathname : '';
}

export function Header() {
  const { pathname } = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState(() => getRouteActiveHref(pathname));
  const [indicator, setIndicator] = useState({ x: 0, width: 0, ready: false });
  const desktopNavRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setActiveHref(getRouteActiveHref(pathname));
    setOpen(false);
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
    document.fonts?.ready?.then(updateIndicator).catch(() => {});
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeHref]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => event.key === 'Escape' && setOpen(false);
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
          {PRIMARY_NAVIGATION.map((item) => (
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
          {PRIMARY_NAVIGATION.map((item, index) => (
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
          <SmartLink href="/faq" onClick={closeMenu} tabIndex={open ? 0 : -1}>Frequently asked questions <span aria-hidden="true">↗</span></SmartLink>
          <SmartLink href="/dealer-login" onClick={closeMenu} tabIndex={open ? 0 : -1}>Dealer login <span aria-hidden="true">↗</span></SmartLink>
        </div>
      </div>
    </>
  );
}

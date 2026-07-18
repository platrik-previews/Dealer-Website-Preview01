import { useEffect, useRef } from 'react';
import { business } from '../config/business';
import { navigate } from '../hooks/usePathname';
import { SmartLink } from './SiteShell';

export const formatPrice = (price) => new Intl.NumberFormat(business.regional.locale, {
  style: 'currency',
  currency: business.regional.currency,
  maximumFractionDigits: 0,
}).format(Number(price || 0));

export const formatMileage = (mileage) => new Intl.NumberFormat(business.regional.locale).format(Number(mileage || 0));

const isModifiedClick = (event) => (
  event.defaultPrevented
  || event.button !== 0
  || event.metaKey
  || event.ctrlKey
  || event.shiftKey
  || event.altKey
);

export function VehicleCard({ vehicle, priority = false }) {
  const cardRef = useRef(null);
  const surfaceRef = useRef(null);
  const frameRef = useRef(0);
  const navigationTimerRef = useRef(0);
  const touchTimerRef = useRef(0);
  const image = vehicle.thumbnails?.[0] || vehicle.images?.[0];
  const href = `/vehicle/${vehicle.id}`;

  useEffect(() => () => {
    cancelAnimationFrame(frameRef.current);
    window.clearTimeout(navigationTimerRef.current);
    window.clearTimeout(touchTimerRef.current);
  }, []);

  const canUseTilt = () => (
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const updateInteractionOrigin = (clientX, clientY) => {
    const card = cardRef.current;
    if (!card) return { x: 50, y: 50 };

    const rect = card.getBoundingClientRect();
    const hasPointerPosition = Number.isFinite(clientX) && Number.isFinite(clientY) && (clientX !== 0 || clientY !== 0);
    const x = hasPointerPosition ? ((clientX - rect.left) / rect.width) * 100 : 50;
    const y = hasPointerPosition ? ((clientY - rect.top) / rect.height) * 100 : 50;
    const safeX = Math.max(0, Math.min(100, x));
    const safeY = Math.max(0, Math.min(100, y));

    card.style.setProperty('--card-origin-x', `${safeX}%`);
    card.style.setProperty('--card-origin-y', `${safeY}%`);
    return { x: safeX, y: safeY };
  };

  const resetTilt = () => {
    const card = cardRef.current;
    if (!card) return;
    cancelAnimationFrame(frameRef.current);
    card.classList.remove('is-tilting');
    card.style.setProperty('--card-tilt-x', '0deg');
    card.style.setProperty('--card-tilt-y', '0deg');
  };

  const handlePointerMove = (event) => {
    if (!canUseTilt()) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const localX = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const localY = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    const rotateY = (localX - 0.5) * 10;
    const rotateX = (0.5 - localY) * 8;

    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      card.classList.add('is-tilting');
      card.style.setProperty('--card-tilt-x', `${rotateX.toFixed(2)}deg`);
      card.style.setProperty('--card-tilt-y', `${rotateY.toFixed(2)}deg`);
      card.style.setProperty('--card-origin-x', `${(localX * 100).toFixed(1)}%`);
      card.style.setProperty('--card-origin-y', `${(localY * 100).toFixed(1)}%`);
    });
  };

  const createWave = (clientX, clientY) => {
    const surface = surfaceRef.current;
    if (!surface) return;

    const { x, y } = updateInteractionOrigin(clientX, clientY);
    const wave = document.createElement('span');
    wave.className = 'vehicle-card__wave';
    wave.style.left = `${x}%`;
    wave.style.top = `${y}%`;
    wave.setAttribute('aria-hidden', 'true');
    surface.appendChild(wave);
    wave.addEventListener('animationend', () => wave.remove(), { once: true });
  };

  const handlePointerDown = (event) => {
    updateInteractionOrigin(event.clientX, event.clientY);
    if (event.pointerType === 'mouse') return;

    const card = cardRef.current;
    if (!card) return;
    window.clearTimeout(touchTimerRef.current);
    card.classList.add('is-touch-pressed');
  };

  const releaseTouch = () => {
    const card = cardRef.current;
    if (!card) return;
    touchTimerRef.current = window.setTimeout(() => card.classList.remove('is-touch-pressed'), 120);
  };

  const handleClick = (event) => {
    if (isModifiedClick(event)) return;

    event.preventDefault();
    const card = cardRef.current;
    createWave(event.clientX, event.clientY);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      navigate(href);
      return;
    }

    card?.classList.remove('is-activating');
    void card?.offsetWidth;
    card?.classList.add('is-activating');

    window.clearTimeout(navigationTimerRef.current);
    const isCoarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    navigationTimerRef.current = window.setTimeout(() => navigate(href), isCoarsePointer ? 280 : 190);
  };

  return (
    <SmartLink
      ref={cardRef}
      href={href}
      className="vehicle-card reveal"
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={(event) => {
        resetTilt();
        if (event.pointerType !== 'mouse') releaseTouch();
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={releaseTouch}
      onPointerCancel={releaseTouch}
    >
      <article ref={surfaceRef} className="vehicle-card__surface">
        <span className="vehicle-card__mobile-scan" aria-hidden="true" />
        <div className="vehicle-card__media">
          {image ? <img src={image} alt={vehicle.title} loading={priority ? 'eager' : 'lazy'} decoding="async" /> : <div className="image-placeholder">No image</div>}
          <span className={`status status--${String(vehicle.status).toLowerCase()}`}>{vehicle.status}</span>
          <span className="vehicle-card__year">{vehicle.year}</span>
        </div>
        <div className="vehicle-card__body">
          <p>{vehicle.make}</p>
          <h3>{vehicle.title}</h3>
          <div className="vehicle-card__specs">
            <span>{formatMileage(vehicle.mileage)} {business.regional.distanceUnit}</span><span>{vehicle.fuel}</span><span>{vehicle.transmission}</span>
          </div>
          <div className="vehicle-card__footer"><strong>{formatPrice(vehicle.price)}</strong><span>View vehicle <b>↗</b></span></div>
        </div>
      </article>
    </SmartLink>
  );
}

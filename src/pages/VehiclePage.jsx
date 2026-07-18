import { useEffect, useState } from 'react';
import { business } from '../config/business';
import { SiteShell, SmartLink } from '../components/SiteShell';
import { formatMileage, formatPrice } from '../components/VehicleCard';

export function VehiclePage({ vehicle, loading }) {
  const [activeImage, setActiveImage] = useState(0);
  useEffect(() => setActiveImage(0), [vehicle?.id]);

  if (loading) return <SiteShell><div className="page-loading"><i /></div></SiteShell>;
  if (!vehicle) return <SiteShell><section className="empty-state empty-state--page"><h1>Vehicle not found.</h1><SmartLink href="/inventory" className="button button--primary">Return to stock</SmartLink></section></SiteShell>;

  const page = business.vehiclePage;
  const images = vehicle.images?.length ? vehicle.images : vehicle.thumbnails || [];
  const whatsappMessage = page.whatsappMessage.replace('{vehicle}', vehicle.title);

  return (
    <SiteShell>
      <section className="vehicle-detail">
        <SmartLink href="/inventory" className="back-link">← Back to current stock</SmartLink>
        <div className="vehicle-detail__gallery">
          <div className="vehicle-detail__main-image">{images[activeImage] ? <img src={images[activeImage]} alt={`${vehicle.title} view ${activeImage + 1}`} /> : <div className="image-placeholder">No image</div>}<span className={`status status--${String(vehicle.status).toLowerCase()}`}>{vehicle.status}</span><span className="image-count">{activeImage + 1} / {Math.max(images.length, 1)}</span></div>
          {images.length > 1 && <div className="vehicle-thumbs">{images.map((image, index) => <button key={`${image}-${index}`} type="button" className={index === activeImage ? 'is-active' : ''} onClick={() => setActiveImage(index)}><img src={vehicle.thumbnails?.[index] || image} alt="" loading="lazy" /></button>)}</div>}
        </div>
        <div className="vehicle-detail__info">
          <p className="eyebrow">{vehicle.year} · {vehicle.make}</p>
          <h1>{vehicle.title}</h1>
          <strong className="vehicle-detail__price">{formatPrice(vehicle.price)}</strong>
          <div className="spec-grid">
            {[
              ['Mileage', `${formatMileage(vehicle.mileage)} ${business.regional.distanceUnit}`],
              ['Fuel', vehicle.fuel],
              ['Transmission', vehicle.transmission],
              ['Body', vehicle.bodyType],
              ['Colour', vehicle.colour],
              ['Status', vehicle.status],
            ].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value || '—'}</strong></div>)}
          </div>
          <div className="vehicle-description"><h2>{page.descriptionHeading}</h2><p>{vehicle.description || page.fallbackDescription}</p></div>
          <div className="vehicle-contact-card"><p>{page.enquiryEyebrow}</p><h2>{page.enquiryHeading}</h2><div className="button-row"><a className="button button--primary" href={business.contact.phoneLink}>{page.callButton}</a><a className="button button--ghost" href={`${business.contact.whatsappLink}?text=${encodeURIComponent(whatsappMessage)}`}>{page.whatsappButton}</a></div><small>Quote reference: {vehicle.id.slice(0, 8).toUpperCase()}</small></div>
        </div>
      </section>
    </SiteShell>
  );
}

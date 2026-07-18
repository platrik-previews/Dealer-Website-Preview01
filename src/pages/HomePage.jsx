import { business } from '../config/business';
import { SiteShell, SmartLink } from '../components/SiteShell';
import { HeroExperience } from '../components/HeroExperience';
import { VehicleCard } from '../components/VehicleCard';
import { AnimatedInspectionMetric, AnimatedTrustMetric } from '../components/AnimatedMetrics';

export function HomePage({ vehicles, loading }) {
  const featured = vehicles.filter((vehicle) => vehicle.featured && vehicle.status !== 'Sold').slice(0, 3);
  const displayVehicles = featured.length ? featured : vehicles.filter((vehicle) => vehicle.status !== 'Sold').slice(0, 3);
  const heroImage = displayVehicles[0]?.images?.[0] || displayVehicles[0]?.thumbnails?.[0];
  const { about, stockPreview, inspection, servicesHeading } = business.home;

  return (
    <SiteShell>
      <HeroExperience image={heroImage} />

      <section className="trust-strip">
        {business.home.trustPoints.map(([value, label, animate]) => (
          <div key={label} className="reveal">
            {animate ? <AnimatedTrustMetric value={value} /> : <strong>{value}</strong>}
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="split-section" id="about">
        <div className="split-section__label reveal"><span>{about.sectionNumber}</span><p>{about.sectionLabel}</p></div>
        <div className="split-section__content reveal">
          <p className="eyebrow">{about.eyebrow}</p>
          <h2>{about.headingLines.map((line) => <span key={line}>{line}<br /></span>)}<em>{about.headingAccent}</em></h2>
          <p>{about.description}</p>
          <SmartLink className="text-link" href="/inventory">{about.linkLabel} <span>↗</span></SmartLink>
        </div>
      </section>

      <section className="stock-preview" id="stock">
        <div className="section-heading reveal">
          <div><p className="eyebrow">{stockPreview.eyebrow}</p><h2>{stockPreview.headingLines.map((line) => <span key={line}>{line}<br /></span>)}</h2></div>
          <SmartLink href="/inventory" className="button button--ghost">{stockPreview.buttonLabel}</SmartLink>
        </div>
        {loading ? <div className="loading-grid"><i /><i /><i /></div> : <div className="vehicle-grid">{displayVehicles.map((vehicle, index) => <VehicleCard key={vehicle.id} vehicle={vehicle} priority={index === 0} />)}</div>}
      </section>

      <section className="manifesto-section">
        <div className="manifesto-section__media reveal">
          <AnimatedInspectionMetric value={inspection.metric} label={inspection.metricLabel} />
        </div>
        <div className="manifesto-section__copy reveal">
          <p className="eyebrow">{inspection.eyebrow}</p>
          <h2>{inspection.heading}</h2>
          <p>{inspection.body}</p>
          <div className="mini-list">{inspection.points.map((point) => <span key={point}>{point}</span>)}</div>
        </div>
      </section>

      <section className="services-section" id="services">
        <div className="section-heading reveal"><div><p className="eyebrow">{servicesHeading.eyebrow}</p><h2>{servicesHeading.headingLines.map((line) => <span key={line}>{line}<br /></span>)}</h2></div></div>
        <div className="services-list">
          {business.services.map((service) => <article key={service.number} className="service-row reveal"><span>{service.number}</span><h3>{service.title}</h3><p>{service.text}</p><i>↗</i></article>)}
        </div>
      </section>
    </SiteShell>
  );
}

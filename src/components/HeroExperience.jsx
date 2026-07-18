import { useEffect, useRef } from 'react';
import { business } from '../config/business';
import { SmartLink } from './SiteShell';

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const map = (value, start, end) => clamp((value - start) / Math.max(0.0001, end - start));

export function HeroExperience({ image }) {
  const rootRef = useRef(null);
  const hero = business.home.hero;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      root.style.setProperty('--hero-progress', '1');
      root.style.setProperty('--hero-intro', '0');
      root.style.setProperty('--hero-drive', '1');
      root.style.setProperty('--hero-inspect', '1');
      root.style.setProperty('--hero-final', '1');
      return undefined;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const scrollable = Math.max(1, root.offsetHeight - window.innerHeight);
      const progress = clamp(-rect.top / scrollable);
      const intro = 1 - map(progress, 0.08, 0.27);
      const drive = map(progress, 0.08, 0.46);
      const inspect = map(progress, 0.34, 0.72);
      const final = map(progress, 0.68, 0.94);
      const portal = map(progress, 0.02, 0.36);
      const scan = map(progress, 0.3, 0.7);

      root.style.setProperty('--hero-progress', progress.toFixed(4));
      root.style.setProperty('--hero-intro', intro.toFixed(4));
      root.style.setProperty('--hero-drive', drive.toFixed(4));
      root.style.setProperty('--hero-inspect', inspect.toFixed(4));
      root.style.setProperty('--hero-final', final.toFixed(4));
      root.style.setProperty('--hero-portal-left', `${portal * -104}%`);
      root.style.setProperty('--hero-portal-right', `${portal * 104}%`);
      root.style.setProperty('--hero-intro-y', `${(1 - intro) * -9}vh`);
      root.style.setProperty('--hero-car-x', `${32 - drive * 37 + final * 7}vw`);
      root.style.setProperty('--hero-car-y', `${13 - drive * 18 + final * 4}vh`);
      root.style.setProperty('--hero-car-scale', String(0.68 + drive * 0.3 - final * 0.04));
      root.style.setProperty('--hero-car-rotate', `${-7 + drive * 8 - final * 1.5}deg`);
      root.style.setProperty('--hero-copy-shift', `${final * -7}vh`);
      root.style.setProperty('--hero-grid-x', `${progress * 55}px`);
      root.style.setProperty('--hero-track', `${progress * 100}%`);
      root.style.setProperty('--hero-scan-x', `${scan * 120 - 10}%`);
      root.style.setProperty('--hero-word-x', `${52 - drive * 66}vw`);
      root.style.setProperty('--hero-word-opacity', String(clamp(drive * 1.5) * (1 - final)));
      root.style.setProperty('--hero-orbit-one', `${progress * 260}deg`);
      root.style.setProperty('--hero-orbit-two', `${progress * -190}deg`);
      root.style.setProperty('--hero-data-one', String(map(progress, 0.36, 0.48) * (1 - final)));
      root.style.setProperty('--hero-data-two', String(map(progress, 0.46, 0.58) * (1 - final)));
      root.style.setProperty('--hero-data-three', String(map(progress, 0.56, 0.68) * (1 - final)));
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="hero-experience" ref={rootRef}>
      <div className="hero-experience__sticky">
        <div className="hero-experience__grid" aria-hidden="true" />
        <div className="hero-experience__glow" aria-hidden="true" />

        <div className="hero-portal" aria-hidden="true">
          <span className="hero-portal__panel hero-portal__panel--left" data-brand={hero.portalLabel} />
          <span className="hero-portal__panel hero-portal__panel--right" data-brand={hero.portalLabel} />
          <span className="hero-portal__line" />
        </div>

        <div className="hero-intro">
          <p className="eyebrow">{business.identity.eyebrow}</p>
          <h1>{hero.introLines.map((line) => <span key={line}>{line}</span>)}</h1>
          <div className="hero-intro__signal"><i /><span>{hero.scrollLabel}</span></div>
        </div>

        <div className="hero-kinetic-word" aria-hidden="true">{hero.kineticWord}</div>

        <div className="hero-machine" aria-hidden="true">
          <div className="hero-machine__orbit hero-machine__orbit--one" />
          <div className="hero-machine__orbit hero-machine__orbit--two" />
          <div className="hero-machine__frame">
            {image ? <img src={image} alt="" fetchPriority="high" /> : <div className="image-placeholder" />}
            <span className="hero-machine__scan" />
            <span className="hero-machine__edge" />
          </div>
          <div className="hero-machine__shadow" />
          {hero.inspectionSteps.slice(0, 3).map((step, index) => (
            <span key={step} className={`hero-data hero-data--${['one', 'two', 'three'][index]}`}>
              <small>0{index + 1}</small><strong>{step}</strong>
            </span>
          ))}
        </div>

        <div className="hero-final-copy">
          <p className="eyebrow">{hero.finalEyebrow}</p>
          <h2>{hero.finalTitleLines.map((line) => <span key={line}>{line}</span>)}</h2>
          <p>{hero.finalBody}</p>
          <div className="button-row">
            <SmartLink className="button button--primary" href="/inventory">{hero.primaryButton}</SmartLink>
            <a className="button button--ghost" href={business.contact.whatsappLink}>{hero.secondaryButton}</a>
          </div>
        </div>

        <div className="hero-progress" aria-hidden="true">
          <span>{hero.progressLabels[0]}</span><i><b /></i>
          <span>{hero.progressLabels[1]}</span><i><b /></i>
          <span>{hero.progressLabels[2]}</span>
        </div>

        <div className="hero-stage-number" aria-hidden="true">
          <span>01</span><span>02</span><span>03</span>
        </div>
      </div>
    </section>
  );
}

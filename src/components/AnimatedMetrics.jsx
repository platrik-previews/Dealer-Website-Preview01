import { useEffect, useRef, useState } from 'react';
import { business } from '../config/business';

export function AnimatedTrustMetric({ value }) {
  const rootRef = useRef(null);
  const animationFrameRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const rawValue = String(value ?? '0');
  const match = rawValue.match(/^\s*([\d,.]+)\s*(.*)$/);
  const target = Number((match?.[1] || '0').replace(/,/g, '')) || 0;
  const suffix = match?.[2] || '';
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return undefined;

    const completeImmediately = () => {
      hasAnimatedRef.current = true;
      setIsActive(true);
      setCount(target);
    };

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      completeImmediately();
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasAnimatedRef.current) return;

        hasAnimatedRef.current = true;
        setIsActive(true);
        observer.unobserve(element);

        const startedAt = performance.now();
        const duration = 1300;
        const tick = (now) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          setCount(Math.round(target * eased));
          if (progress < 1) animationFrameRef.current = requestAnimationFrame(tick);
        };
        animationFrameRef.current = requestAnimationFrame(tick);
      },
      { threshold: 0.55, rootMargin: '0px 0px -5% 0px' },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [target]);

  return (
    <strong
      ref={rootRef}
      className={`trust-strip__number${isActive ? ' is-active' : ''}`}
      aria-label={rawValue}
    >
      <span>{count.toLocaleString(business.regional.locale)}</span>
      {suffix && <b>{suffix}</b>}
    </strong>
  );
}

export function AnimatedInspectionMetric({ value, label }) {
  const rootRef = useRef(null);
  const animationFrameRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const rawValue = String(value ?? '0');
  const match = rawValue.match(/^\s*([\d,.]+)\s*(.*)$/);
  const target = Number((match?.[1] || '0').replace(/,/g, '')) || 0;
  const suffix = match?.[2] || '';
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return undefined;

    const completeImmediately = () => {
      hasAnimatedRef.current = true;
      setIsActive(true);
      setCount(target);
    };

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      completeImmediately();
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasAnimatedRef.current) return;

        hasAnimatedRef.current = true;
        setIsActive(true);
        observer.unobserve(element);

        const startedAt = performance.now();
        const duration = 1600;
        const tick = (now) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          setCount(Math.round(target * eased));
          if (progress < 1) animationFrameRef.current = requestAnimationFrame(tick);
        };
        animationFrameRef.current = requestAnimationFrame(tick);
      },
      { threshold: 0.38, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [target]);

  return (
    <div ref={rootRef} className={`manifesto-metric-stage${isActive ? ' is-active' : ''}`}>
      <div className="manifesto-orbit" aria-hidden="true"><i /><i /><i /></div>
      <div className="manifesto-metric" aria-label={rawValue}>
        <span>{count.toLocaleString(business.regional.locale)}</span>
        {suffix && <b>{suffix}</b>}
      </div>
      <small>{label}</small>
    </div>
  );
}

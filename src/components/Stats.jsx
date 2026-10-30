import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { cities, countries, languages } from '../data/destinations';
import { useAppLanguage } from '../context/AppLanguageContext';

function useCountUp(target, active, durationMs = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return undefined;

    let frame = 0;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - t) ** 3;
      setValue(Math.floor(eased * target));
      if (t < 1) frame = requestAnimationFrame(tick);
      else setValue(target);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, durationMs]);

  return value;
}

function StatCard({ icon, count, label, to, active, delay }) {
  const value = useCountUp(count, active);

  return (
    <Link
      to={to}
      className={`stats-section__card${active ? ' is-on' : ''}`}
      style={{ '--delay': `${delay}ms` }}
    >
      <div className="stats-section__icon" aria-hidden="true">
        <img src={icon} alt="" />
      </div>
      <p className="stats-section__value">
        <span>{value.toLocaleString()}</span>
      </p>
      <p className="stats-section__label">{label}</p>
    </Link>
  );
}

export default function Stats() {
  const { t } = useAppLanguage();
  const sectionRef = useRef(null);
  const [active, setActive] = useState(false);

  const stats = useMemo(
    () => [
      {
        icon: '/images/city.png',
        count: cities.length,
        label: t.cityGuides,
        to: '/cities',
      },
      {
        icon: '/images/countries_icon.png',
        count: countries.length,
        label: t.countryGuides,
        to: '/countries',
      },
      {
        icon: '/images/languages_bg.png',
        count: languages.length,
        label: t.travelLanguages,
        to: '/languages',
      },
      {
        icon: '/images/travel_icon.png',
        count: cities.length + countries.length,
        label: t.destinations,
        to: '/cities',
      },
    ],
    [t],
  );

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`home-section stats-section${active ? ' is-visible' : ''}`}
      aria-labelledby="stats-heading"
    >
      <div className="container">
        <div className="stats-section__intro">
          <p className="home-section__kicker">{t.builtForTravelers}</p>
          <h2 id="stats-heading" className="stats-section__heading">
            {t.catalogueHeading}
          </h2>
          <p className="stats-section__lead">{t.catalogueLead}</p>
        </div>

        <div className="stats-section__grid">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.to + stat.label}
              {...stat}
              active={active}
              delay={index * 90}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

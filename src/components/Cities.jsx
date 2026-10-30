import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cities as cityData } from '../data/destinations';
import { useAppLanguage } from '../context/AppLanguageContext';

const ArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 139 120" aria-hidden="true">
    <path
      fill="currentColor"
      d="M58.8 8.2c2.2-2.1 5.7-2 7.8.2 2.1 2.2 2 5.7-.2 7.8L32.2 54.3H133c3.1 0 5.6 2.5 5.6 5.6s-2.5 5.6-5.6 5.6H32.2l34.2 38.1c2.2 2.1 2.3 5.6.2 7.8-2.1 2.2-5.6 2.3-7.8.2L8.2 67.8c-2.4-2.7-2.4-6.9 0-9.6L58.8 8.2z"
    />
  </svg>
);

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 139 120" aria-hidden="true">
    <path
      fill="currentColor"
      d="M80.2 8.2c-2.2-2.1-5.7-2-7.8.2-2.1 2.2-2 5.7.2 7.8l34.2 38.1H6c-3.1 0-5.6 2.5-5.6 5.6S2.9 65.5 6 65.5h100.8L72.6 103.6c-2.2 2.1-2.3 5.6-.2 7.8 2.1 2.2 5.6 2.3 7.8.2l50.6-50c2.4-2.7 2.4-6.9 0-9.6L80.2 8.2z"
    />
  </svg>
);

export default function Cities() {
  const { t } = useAppLanguage();
  const [activeIndex, setActiveIndex] = useState(Math.min(4, cityData.length - 1));
  const active = cityData[activeIndex];
  const langNames =
    (active.languages || [])
      .map((l) => t.langNames[l.id] || l.name)
      .join(', ') || t.langNames.en;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? cityData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === cityData.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="home-section first cities-section" aria-labelledby="cities-heading">
      <div className="container">
        <div className="home-section__header">
          <div className="home-section__copy">
            <p className="home-section__kicker">{t.localAiGuides}</p>
            <h2 id="cities-heading" className="title home-section__title">
              {t.cities}
            </h2>
            <p className="home-section__lead d-none d-md-block">
              {t.citiesLead(cityData.length)}
            </p>
          </div>
          <Link to="/cities" className="moreButton home-section__more d-none d-md-inline-flex">
            {t.viewAllCities}
          </Link>
        </div>

        <div className="cities-showcase">
          <div className="cities-showcase__copy">
            <p className="cities-showcase__meta">
              {String(activeIndex + 1).padStart(2, '0')} / {String(cityData.length).padStart(2, '0')}
            </p>
            <h3 className="cities-showcase__name">{active.name}</h3>
            <p className="cities-showcase__country">{active.country}</p>
            <p className="cities-showcase__tagline">{active.tagline}</p>
            <p className="cities-showcase__langs">
              {t.guideLanguages} <strong>{langNames}</strong>
            </p>
            <div className="cities-showcase__actions">
              <Link to={`/guide/${active.id}`} className="moreButton">
                {t.meetTheGuide}
              </Link>
              <div className="cities-showcase__nav">
                <button type="button" onClick={handlePrev} aria-label="Previous city">
                  <ArrowLeft />
                </button>
                <button type="button" onClick={handleNext} aria-label="Next city">
                  <ArrowRight />
                </button>
              </div>
            </div>
          </div>

          <Link
            to={`/guide/${active.id}`}
            className="cities-showcase__media"
            aria-label={`Open ${active.name} guide`}
            style={{ backgroundImage: `url(${active.image})` }}
          >
            <span className="cities-showcase__media-shade" aria-hidden="true" />
          </Link>
        </div>

        <div className="home-section__mobile-cta d-md-none">
          <Link to="/cities" className="moreButton">
            {t.viewAllCities}
          </Link>
        </div>
      </div>

      <img
        className="cities-section__footer-art"
        src="/images/bottom_mountain.png"
        width="100%"
        alt=""
      />
    </section>
  );
}

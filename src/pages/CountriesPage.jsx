import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageLayout, { PageHero } from '../components/layout/PageLayout';
import ApiKeyGate from '../components/ai/ApiKeyGate';
import LanguageToggle from '../components/LanguageToggle';
import { useAppLanguage } from '../context/AppLanguageContext';
import {
  countries,
  getDestinationLanguages,
  slugifyCountryName,
} from '../data/destinations';

export default function CountriesPage() {
  const featured = countries[0];
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { t } = useAppLanguage();

  const openAnyCountry = (e) => {
    e.preventDefault();
    const slug = slugifyCountryName(query);
    if (!slug) return;
    navigate(`/guide/${slug}`);
  };

  return (
    <PageLayout>
      <PageHero
        image={featured?.image}
        title={t.countries}
        tagline={t.countryLead}
        backTo="/"
      />

      <div className="container destinations-page">
        <div className="destinations-page__lang">
          <LanguageToggle />
        </div>
        <ApiKeyGate />

        <div className="destinations-page__intro">
          <p className="destinations-page__kicker">{t.countryKicker}</p>
          <p className="destinations-page__lead">{t.countryLead}</p>
        </div>

        <form className="destinations-page__any" onSubmit={openAnyCountry}>
          <label className="destinations-page__any-label" htmlFor="any-country">
            {t.exploreAny}
          </label>
          <div className="destinations-page__any-row">
            <input
              id="any-country"
              className="destinations-page__any-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.countryPlaceholder}
              autoComplete="off"
            />
            <button type="submit" className="moreButton" disabled={!query.trim()}>
              {t.openGuide}
            </button>
          </div>
        </form>

        <div className="destinations-page__grid">
          {countries.map((country, index) => {
            const langs = getDestinationLanguages(country);
            return (
              <Link
                key={country.id}
                to={`/guide/${country.id}`}
                className="destination-card"
                style={{ '--i': index }}
              >
                <div
                  className="destination-card__media"
                  style={{ backgroundImage: `url(${country.image})` }}
                />
                <div className="destination-card__shade" aria-hidden="true" />
                <div className="destination-card__body">
                  <p className="destination-card__meta">{t.countries}</p>
                  <h3 className="destination-card__name">{country.name}</h3>
                  <p className="destination-card__desc">{country.tagline}</p>
                  <div className="destination-card__langs">
                    {langs.map((lang) => (
                      <span key={lang.id} className="destination-card__lang">
                        {lang.flag && (
                          <img src={lang.flag} alt="" className="destination-card__flag" />
                        )}
                        {t.langNames[lang.id] || lang.name}
                      </span>
                    ))}
                  </div>
                  <span className="destination-card__cta">
                    {t.chatCta}
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
}

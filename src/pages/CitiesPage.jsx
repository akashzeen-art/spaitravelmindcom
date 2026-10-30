import { Link } from 'react-router-dom';
import PageLayout, { PageHero } from '../components/layout/PageLayout';
import ApiKeyGate from '../components/ai/ApiKeyGate';
import LanguageToggle from '../components/LanguageToggle';
import { useAppLanguage } from '../context/AppLanguageContext';
import { cities, getDestinationLanguages } from '../data/destinations';

export default function CitiesPage() {
  const featured = cities[0];
  const { t } = useAppLanguage();

  return (
    <PageLayout>
      <PageHero
        image={featured?.image}
        title={t.cities}
        tagline={t.cityLead}
        backTo="/"
      />

      <div className="container destinations-page">
        <div className="destinations-page__lang">
          <LanguageToggle />
        </div>
        <ApiKeyGate />

        <div className="destinations-page__intro">
          <p className="destinations-page__kicker">{t.cityKicker}</p>
          <p className="destinations-page__lead">{t.cityLead}</p>
        </div>

        <div className="destinations-page__grid">
          {cities.map((city, index) => {
            const langs = getDestinationLanguages(city);
            return (
              <Link
                key={city.id}
                to={`/guide/${city.id}`}
                className="destination-card"
                style={{ '--i': index }}
              >
                <div
                  className="destination-card__media"
                  style={{ backgroundImage: `url(${city.image})` }}
                />
                <div className="destination-card__shade" aria-hidden="true" />
                <div className="destination-card__body">
                  <p className="destination-card__meta">{city.country}</p>
                  <h3 className="destination-card__name">{city.name}</h3>
                  <p className="destination-card__desc">{city.tagline}</p>
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

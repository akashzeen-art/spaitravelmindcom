import { Link } from 'react-router-dom';
import PageLayout, { PageHero } from '../components/layout/PageLayout';
import ApiKeyGate from '../components/ai/ApiKeyGate';
import LanguageToggle from '../components/LanguageToggle';
import { useAppLanguage } from '../context/AppLanguageContext';
import { languages } from '../data/destinations';

export default function LanguagesPage() {
  const { t } = useAppLanguage();

  return (
    <PageLayout>
      <PageHero
        image="/images/languages_bg.png"
        title={t.languages}
        tagline=""
        backTo="/"
      />

      <div className="container destinations-page">
        <div className="destinations-page__lang">
          <LanguageToggle />
        </div>
        <ApiKeyGate requireBrowserKey={false} />

        <div className="destinations-page__intro">
          <p className="destinations-page__kicker">{t.travelLanguageCoach}</p>
          <p className="destinations-page__lead">{t.languagesPageLead}</p>
        </div>

        <div className="destinations-page__grid destinations-page__grid--langs">
          {languages.map((lang, index) => (
            <Link
              key={lang.id}
              to={`/languages/${lang.id}`}
              className="destination-card destination-card--lang"
              style={{ '--i': index }}
            >
              <div
                className="destination-card__media destination-card__media--lang"
                style={{ backgroundImage: `url(${lang.flag})` }}
              />
              <div className="destination-card__shade" aria-hidden="true" />
              <div className="destination-card__body">
                <p className="destination-card__meta">{t.practice}</p>
                <h3 className="destination-card__name">
                  {t.langNames[lang.id] || lang.name}
                </h3>
                <p className="destination-card__desc">
                  {t.conversationPractice(lang.nativeName)}
                </p>
                <span className="destination-card__cta">
                  {t.startAiLesson}
                  <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

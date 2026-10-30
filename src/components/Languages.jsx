import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { languages as languageList } from '../data/destinations';
import { useAppLanguage } from '../context/AppLanguageContext';

export default function Languages() {
  const { t } = useAppLanguage();
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`home-section languages-section${visible ? ' is-visible' : ''}`}
      aria-labelledby="languages-heading"
    >
      <div className="container">
        <div className="home-section__header">
          <div className="home-section__copy">
            <p className="home-section__kicker">{t.speakBeforeYouGo}</p>
            <h2 id="languages-heading" className="title home-section__title">
              {t.languages}
            </h2>
            <p className="home-section__lead d-none d-md-block">
              {t.languagesLead(languageList.length)}
            </p>
          </div>
          <Link
            to="/languages"
            className="moreButton home-section__more languages-section__more-desktop"
          >
            {t.viewAllLanguages}
          </Link>
        </div>

        <div className="languages-section__stage">
          <div className="languages-section__panel">
            <div className="languages-section__visual">
              <div className="languages-section__glow" aria-hidden="true" />
              <img
                src="/images/teacher.png"
                className="languages-section__teacher"
                alt="AI language tutor"
              />

              <ul className="languages-section__flags" aria-label="Practice languages">
                {languageList.slice(0, 5).map((lang, index) => (
                  <li
                    key={lang.id}
                    className="languages-section__flag"
                    style={{ '--i': index }}
                  >
                    <Link to={`/languages/${lang.id}`} title={t.langNames[lang.id] || lang.name}>
                      <img src={lang.flag} alt={t.langNames[lang.id] || lang.name} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="languages-section__content">
              <p className="languages-section__lead">{t.languagesPanelLead}</p>

              <ul className="languages-section__features">
                {t.languageFeatures.map((feature, index) => (
                  <li
                    key={feature.title}
                    className="languages-section__feature"
                    style={{ '--i': index }}
                  >
                    <img
                      src="/images/lang-check.png"
                      className="languages-section__check"
                      alt=""
                    />
                    <div>
                      <strong>{feature.title}</strong>
                      <span>{feature.text}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="languages-section__chips" aria-label="Available languages">
                {languageList.map((lang) => (
                  <Link
                    key={lang.id}
                    to={`/languages/${lang.id}`}
                    className="languages-section__chip"
                  >
                    <img src={lang.flag} alt="" />
                    <span>{t.langNames[lang.id] || lang.name}</span>
                  </Link>
                ))}
              </div>

              <div className="languages-section__cta">
                <Link to="/languages" className="moreButton">
                  {t.startPracticing}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

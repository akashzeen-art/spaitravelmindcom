import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageLayout, { PageHero } from '../components/layout/PageLayout';
import AiChat from '../components/ai/AiChat';
import ApiKeyGate from '../components/ai/ApiKeyGate';
import LanguageToggle from '../components/LanguageToggle';
import { useAppLanguage } from '../context/AppLanguageContext';
import { buildGuideGreeting, getDestination } from '../data/destinations';
import { buildGuideSystemPrompt } from '../services/openai';
import { useAiChat } from '../hooks/useAiChat';

export default function GuidePage() {
  const { slug } = useParams();
  const { lang, t, langId } = useAppLanguage();
  const destination = getDestination(slug);

  const systemPrompt = useMemo(() => {
    if (!destination) return '';
    return buildGuideSystemPrompt(destination, lang);
  }, [destination, lang]);

  const greeting = destination ? buildGuideGreeting(destination, langId) : '';
  const { messages, setMessages, isLoading, error, sendMessage, resetChat } =
    useAiChat(systemPrompt);

  useEffect(() => {
    if (greeting) resetChat(greeting);
  }, [greeting, resetChat, slug, langId]);

  if (!destination) {
    return (
      <PageLayout>
        <div className="container empty-state">
          <p className="ai-guide-page__kicker">Missing</p>
          <h1 className="ai-page__heading" style={{ textAlign: 'center' }}>
            {t.destinationMissing}
          </h1>
          <p className="empty-state__lead">{t.destinationMissingLead}</p>
          <div className="empty-state__actions">
            <Link to="/cities" className="moreButton">
              {t.browseCities}
            </Link>
            <Link to="/countries" className="moreButton moreButton--ghost">
              {t.browseCountries}
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  const isCity = destination.type === 'city';
  const backTo = isCity ? '/cities' : '/countries';
  const prompts =
    t.prompts[destination.type] || t.prompts.country;
  const placeLabel = isCity
    ? `${destination.name}, ${destination.country}`
    : destination.name;
  const categoryLabel = isCity
    ? t.cityGuide
    : destination.custom
      ? t.anyCountry
      : t.countryGuide;

  return (
    <PageLayout>
      <PageHero
        className="ai-page__hero--guide"
        image={destination.image}
        title={destination.name}
        tagline={destination.tagline || destination.country}
        backTo={backTo}
        backLabel={isCity ? t.cities : t.countries}
        badge={categoryLabel}
      />

      <div className="container ai-guide-page ai-guide-page--live">
        <div className="ai-guide-page__toolbar">
          <div className="ai-guide-page__identity">
            <div className="ai-guide-page__badges">
              <span className="ai-guide-page__badge">{categoryLabel}</span>
              {isCity && destination.country && (
                <span className="ai-guide-page__badge ai-guide-page__badge--soft">
                  {destination.country}
                </span>
              )}
            </div>
            <h2 className="ai-guide-page__place">{destination.name}</h2>
            <p className="ai-guide-page__lead">
              {t.askLead(placeLabel)}
            </p>
          </div>

          <div className="ai-guide-page__controls">
            <p className="ai-guide-page__control-label">{t.guideLanguage}</p>
            <LanguageToggle />
          </div>
        </div>

        <ApiKeyGate />

        <div className="ai-guide-page__panel">
          <AiChat
            key={`${destination.id}-${langId}`}
            title={destination.name}
            subtitle={`${lang.name} · ${t.textVoice}`}
            destinationName={destination.name}
            destinationImage={destination.image}
            guideName={null}
            messages={messages}
            setMessages={setMessages}
            isLoading={isLoading}
            error={error}
            prompts={prompts}
            onSend={sendMessage}
            onReset={() => resetChat(greeting)}
            placeholder={t.askAbout(destination.name)}
          />
        </div>
      </div>
    </PageLayout>
  );
}

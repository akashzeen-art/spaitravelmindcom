import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageLayout, { PageHero } from '../components/layout/PageLayout';
import AiChat from '../components/ai/AiChat';
import ApiKeyGate from '../components/ai/ApiKeyGate';
import { getLanguage, quickPrompts } from '../data/destinations';
import { buildLanguageSystemPrompt } from '../services/openai';
import { useAiChat } from '../hooks/useAiChat';

export default function LanguagePracticePage() {
  const { langId } = useParams();
  const language = getLanguage(langId);

  const systemPrompt = useMemo(
    () => (language ? buildLanguageSystemPrompt(language) : ''),
    [language],
  );

  const { messages, setMessages, isLoading, error, sendMessage, resetChat } =
    useAiChat(systemPrompt);

  useEffect(() => {
    if (language) resetChat(language.greeting);
  }, [language, resetChat]);

  if (!language) {
    return (
      <PageLayout>
        <div className="container empty-state">
          <p className="ai-guide-page__kicker">Missing</p>
          <h1 className="ai-page__heading" style={{ textAlign: 'center' }}>
            Language not found
          </h1>
          <p className="empty-state__lead">
            That language is not available yet. Browse the list and pick another coach.
          </p>
          <div className="empty-state__actions">
            <Link to="/languages" className="moreButton">
              Browse languages
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHero
        className="ai-page__hero--guide"
        image={language.flag}
        title={`${language.name} for travel`}
        tagline=""
        backTo="/languages"
        backLabel="Languages"
        badge="Travel practice"
      />
      <div className="container ai-guide-page ai-guide-page--live">
        <div className="ai-guide-page__intro">
          <p className="ai-guide-page__kicker">Tour language coach</p>
          <p className="ai-guide-page__lead">
            Practice real travel situations in <strong>{language.name}</strong> — hotels, food,
            directions, and local small talk. Type or use the mic; replies stay in chat.
          </p>
        </div>
        <ApiKeyGate />
        <div className="ai-guide-page__panel">
          <AiChat
            title={language.nativeName || language.name}
            subtitle={`${language.name} · Text + voice reply`}
            destinationName={language.name}
            destinationImage={language.flag}
            guideName={null}
            messages={messages}
            setMessages={setMessages}
            isLoading={isLoading}
            error={error}
            prompts={quickPrompts.language}
            onSend={sendMessage}
            onReset={() => resetChat(language.greeting)}
            placeholder={`Practice travel ${language.name}…`}
          />
        </div>
      </div>
    </PageLayout>
  );
}

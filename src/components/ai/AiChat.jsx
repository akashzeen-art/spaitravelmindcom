import { useEffect, useRef, useState } from 'react';
import { useSpeechToText } from '../../hooks/useSpeechToText';
import { useReplySpeech } from '../../hooks/useReplySpeech';
import { useAppLanguage } from '../../context/AppLanguageContext';
import { unlockAudioPlayback } from '../../services/tts';

function TypingDots() {
  return (
    <span className="ai-chat__typing" aria-label="Pensando">
      <span />
      <span />
      <span />
    </span>
  );
}

export default function AiChat({
  title,
  subtitle,
  destinationName,
  destinationImage,
  messages,
  setMessages,
  isLoading,
  error,
  prompts = [],
  onSend,
  onReset,
  placeholder = 'Ask your AI guide anything…',
  guideName = null,
}) {
  const { t } = useAppLanguage();
  const [input, setInput] = useState('');
  const messagesRef = useRef(null);
  const inputRef = useRef(null);

  const speechToText = useSpeechToText();
  const replySpeech = useReplySpeech();

  const {
    listening,
    transcribing,
    error: voiceError,
    toggle: toggleVoice,
    stop: stopVoice,
    setError: setVoiceError,
  } = speechToText;

  const {
    isSpeaking,
    speakingMessageId,
    error: speechError,
    toggleSpeak,
    stop: stopSpeech,
    maybeSyncReply,
    resetSpoken,
  } = replySpeech;

  const busy = isLoading || listening || transcribing || isSpeaking;
  const sendLabel = isLoading
    ? t.sending
    : transcribing
      ? t.transcribing
      : listening
        ? t.listening
        : isSpeaking
          ? t.speaking
          : t.send;
  const guideInitial = (guideName || destinationName || 'TX')
    .trim()
    .charAt(0)
    .toUpperCase();
  const showEmpty = messages.length === 0;
  const hasUserMessage = messages.some((msg) => msg.role === 'user');
  const showPrompts = prompts.length > 0 && !busy && !hasUserMessage;
  const displayError = error || voiceError || speechError;

  useEffect(() => {
    const box = messagesRef.current;
    if (!box) return;
    const distanceFromBottom = box.scrollHeight - box.scrollTop - box.clientHeight;
    // Keep reading history undisturbed; only stick to bottom when already near it.
    if (distanceFromBottom < 120) {
      box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading, isSpeaking]);

  useEffect(() => {
    if (typeof setMessages !== 'function' || isLoading) return;
    maybeSyncReply(messages, setMessages);
  }, [messages, setMessages, isLoading, maybeSyncReply]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || busy) return;
    unlockAudioPlayback();
    stopVoice();
    stopSpeech();
    onSend(input);
    setInput('');
    setVoiceError(null);
  };

  const handlePrompt = (prompt) => {
    if (busy) return;
    unlockAudioPlayback();
    stopVoice();
    stopSpeech();
    onSend(prompt);
  };

  const handleReset = () => {
    stopVoice();
    resetSpoken();
    onReset?.();
    setInput('');
    setVoiceError(null);
    inputRef.current?.focus();
  };

  const handleMic = () => {
    if (isLoading || transcribing || isSpeaking) return;
    unlockAudioPlayback();
    stopSpeech();
    toggleVoice({
      onInterim: (text) => {
        if (text) setInput(text);
      },
      onFinal: (text) => {
        if (!text?.trim()) return;
        setInput(text);
        onSend(text);
        setInput('');
      },
    });
  };

  return (
    <div className="ai-guide-stage ai-guide-stage--chat-only">
      <section className="ai-chat" aria-label="Conversación con la guía">
        <header className="ai-chat__header">
          <div className="ai-chat__header-main">
            {destinationImage && (
              <div
                className="ai-chat__dest-thumb"
                style={{ backgroundImage: `url(${destinationImage})` }}
                aria-hidden="true"
              />
            )}
            <div>
              <h2 className="ai-chat__title">{title}</h2>
              {subtitle && <p className="ai-chat__subtitle">{subtitle}</p>}
            </div>
          </div>
          <div className="ai-chat__header-actions">
            {isSpeaking && (
              <button type="button" className="ai-chat__icon-btn" onClick={stopSpeech}>
                {t.stopVoice}
              </button>
            )}
            {onReset && (
              <button
                type="button"
                className="ai-chat__icon-btn"
                onClick={handleReset}
                disabled={busy && !isSpeaking}
                title={t.newChat}
              >
                {t.newChat}
              </button>
            )}
          </div>
        </header>

        <div className="ai-chat__messages" ref={messagesRef}>
          {showEmpty && (
            <div className="ai-chat__empty">
              <p className="ai-chat__empty-kicker">{t.ready}</p>
              <p className="ai-chat__empty-title">
                {guideName ? t.chatWith(guideName) : t.chatWith(destinationName || 'Trip XAI')}
              </p>
              <p className="ai-chat__empty-text">{t.emptyHint(destinationName)}</p>
            </div>
          )}

          {messages.map((msg, index) => {
            const isLast = index === messages.length - 1;
            const waiting =
              msg.role === 'assistant' &&
              !msg.content &&
              (isLoading || msg._awaitingSync) &&
              isLast;
            const typewriting = Boolean(msg._typing && msg.content);
            const speakingHere = speakingMessageId === msg.id;
            return (
              <div
                key={msg.id}
                className={`ai-chat__bubble-wrap ai-chat__bubble-wrap--${msg.role}${
                  speakingHere ? ' ai-chat__bubble-wrap--speaking' : ''
                }${typewriting ? ' ai-chat__bubble-wrap--typing' : ''}`}
              >
                {msg.role === 'assistant' && (
                  <span className="ai-chat__avatar-mark" aria-hidden="true">
                    {guideInitial}
                  </span>
                )}
                <div
                  className={`ai-chat__bubble ai-chat__bubble--${msg.role}${
                    waiting ? ' ai-chat__bubble--typing' : ''
                  }`}
                >
                  {waiting ? (
                    <TypingDots />
                  ) : (
                    <>
                      {msg.content}
                      {typewriting && (
                        <span className="ai-chat__cursor" aria-hidden="true" />
                      )}
                    </>
                  )}
                </div>
                {msg.role === 'assistant' &&
                  (msg.content?.trim() || speakingHere) &&
                  !waiting && (
                    <button
                      type="button"
                      className={`ai-chat__speak-btn${speakingHere ? ' is-playing' : ''}`}
                      onClick={() => toggleSpeak(msg._fullText || msg.content, msg.id)}
                      disabled={isLoading || listening || transcribing}
                      title={speakingHere ? 'Detener voz' : 'Reproducir voz'}
                      aria-label={speakingHere ? 'Detener voz' : 'Reproducir voz'}
                    >
                      {speakingHere ? '⏹' : '🔊'}
                    </button>
                  )}
              </div>
            );
          })}

          {showPrompts && (
            <div className="ai-chat__prompts" aria-label="Preguntas sugeridas">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="ai-chat__prompt-btn"
                  onClick={() => handlePrompt(prompt)}
                  disabled={busy}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
        </div>

        {displayError && (
          <div className="ai-chat__error" role="alert">
            {displayError}
          </div>
        )}

        <form className="ai-chat__input-row" onSubmit={handleSubmit}>
          <button
            type="button"
            className={`ai-chat__mic${listening ? ' is-listening' : ''}${
              transcribing ? ' is-transcribing' : ''
            }`}
            onClick={handleMic}
            disabled={isLoading || transcribing || isSpeaking}
            title={
              listening
                ? 'Toca para detener y enviar'
                : transcribing
                  ? 'Transcribiendo…'
                  : 'Toca para hablar'
            }
            aria-pressed={listening}
            aria-label={listening ? 'Detener entrada de voz' : 'Iniciar entrada de voz'}
          >
            {transcribing ? '…' : listening ? '■' : '🎤'}
          </button>
          <input
            ref={inputRef}
            className="ai-chat__input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              listening
                ? t.listenHint
                : transcribing
                  ? t.transcribing
                  : isSpeaking
                    ? t.playingVoice
                    : placeholder
            }
            disabled={isLoading || listening || transcribing}
            autoComplete="off"
            aria-label="Mensaje"
          />
          <button className="ai-chat__send" type="submit" disabled={busy || !input.trim()}>
            {sendLabel}
          </button>
        </form>
      </section>
    </div>
  );
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAi } from '../context/AiContext';
import { useAppLanguage } from '../context/AppLanguageContext';
import {
  fetchOpenAiSpeech,
  speakWithBrowser,
  stopBrowserSpeech,
  unlockAudioPlayback,
} from '../services/tts';

/**
 * Plays reply voice and reveals text in sync with audio progress.
 * Hook order is fixed — do not insert hooks conditionally.
 */
export function useReplySpeech() {
  const { apiKey, hasApiKey } = useAi();
  const { lang } = useAppLanguage();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [error, setError] = useState(null);

  const audioRef = useRef(null);
  const objectUrlRef = useRef(null);
  const speakGenRef = useRef(0);
  const syncedIdsRef = useRef(new Set());

  const stop = useCallback(() => {
    speakGenRef.current += 1;
    stopBrowserSpeech();
    const audio = audioRef.current;
    if (audio) {
      try {
        audio.ontimeupdate = null;
        audio.onended = null;
        audio.onerror = null;
        audio.onloadedmetadata = null;
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      } catch {
        // ignore
      }
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setIsSpeaking(false);
    setSpeakingMessageId(null);
  }, []);

  const speakSynced = useCallback(
    async (text, messageId, onReveal) => {
      const fullText = String(text || '').trim();
      if (!fullText) return;

      await unlockAudioPlayback();
      stop();
      const gen = speakGenRef.current;
      setError(null);
      setIsSpeaking(true);
      setSpeakingMessageId(messageId);
      onReveal?.('', false);

      const stillActive = () => gen === speakGenRef.current;

      const syncRevealFromAudio = (audio) => {
        let raf = 0;
        const update = () => {
          if (!stillActive()) return;
          const duration = audio.duration;
          if (!Number.isFinite(duration) || duration <= 0) return;
          const ratio = Math.min(1, Math.max(0, audio.currentTime / duration));
          const slowRatio = Math.pow(ratio, 1.8);
          const chars = Math.max(1, Math.ceil(slowRatio * fullText.length));
          onReveal?.(fullText.slice(0, chars), ratio >= 0.999);
        };
        audio.ontimeupdate = update;
        const tick = () => {
          if (!stillActive()) return;
          update();
          if (!audio.paused && !audio.ended) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => {
          cancelAnimationFrame(raf);
          audio.ontimeupdate = null;
        };
      };

      try {
        let played = false;

        if (hasApiKey && apiKey) {
          try {
            const blob = await fetchOpenAiSpeech(apiKey, fullText, {
              voice: lang.ttsVoice || 'nova',
            });
            if (!stillActive()) return;

            const url = URL.createObjectURL(blob);
            objectUrlRef.current = url;
            const audio = new Audio(url);
            audio.preload = 'auto';
            audioRef.current = audio;

            await new Promise((resolve, reject) => {
              let cleanup = () => {};
              const finish = () => {
                cleanup();
                onReveal?.(fullText, true);
                resolve();
              };
              audio.onended = finish;
              audio.onerror = () => {
                cleanup();
                reject(new Error('Could not play voice reply'));
              };
              const startPlay = async () => {
                if (!stillActive()) {
                  resolve();
                  return;
                }
                cleanup = syncRevealFromAudio(audio);
                try {
                  await audio.play();
                  onReveal?.(fullText.slice(0, 1), false);
                } catch (err) {
                  cleanup();
                  reject(err);
                }
              };
              if (audio.readyState >= 2) startPlay();
              else {
                audio.onloadedmetadata = startPlay;
                audio.load();
              }
            });
            played = true;
          } catch (ttsErr) {
            console.warn('OpenAI TTS failed, using browser voice', ttsErr);
          }
        }

        if (!played && stillActive()) {
          const estimatedMs = Math.max(1800, fullText.length * 85);
          const startedAt = performance.now();
          const speakPromise = speakWithBrowser(fullText, lang.speakLang || 'en-US');
          await new Promise((resolve) => {
            const tick = () => {
              if (!stillActive()) {
                resolve();
                return;
              }
              const ratio = Math.min(1, (performance.now() - startedAt) / estimatedMs);
              const chars = Math.max(1, Math.ceil(ratio * fullText.length));
              onReveal?.(fullText.slice(0, chars), ratio >= 1);
              if (ratio < 1) requestAnimationFrame(tick);
              else resolve();
            };
            requestAnimationFrame(tick);
            speakPromise.finally(() => {
              onReveal?.(fullText, true);
              resolve();
            });
          });
          await speakPromise.catch(() => {});
        }
      } catch (err) {
        if (!stillActive()) return;
        onReveal?.(fullText, true);
        setError(err instanceof Error ? err.message : 'Voice playback failed');
      } finally {
        if (stillActive()) {
          if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = null;
          }
          audioRef.current = null;
          setIsSpeaking(false);
          setSpeakingMessageId(null);
        }
      }
    },
    [apiKey, hasApiKey, lang.speakLang, lang.ttsVoice, stop],
  );

  const speak = useCallback(
    async (text, messageId = null) => {
      await speakSynced(text, messageId, null);
    },
    [speakSynced],
  );

  const toggleSpeak = useCallback(
    (text, messageId) => {
      if (isSpeaking && speakingMessageId === messageId) {
        stop();
        return;
      }
      speak(text, messageId);
    },
    [isSpeaking, speakingMessageId, speak, stop],
  );

  const maybeSyncReply = useCallback(
    (messages, setMessages) => {
      if (typeof setMessages !== 'function') return;
      const pending = [...messages]
        .reverse()
        .find(
          (m) =>
            m.role === 'assistant' &&
            m._fullText &&
            m._awaitingSync &&
            !syncedIdsRef.current.has(m.id),
        );
      if (!pending) return;

      syncedIdsRef.current.add(pending.id);
      const full = pending._fullText;

      speakSynced(full, pending.id, (partial, done) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === pending.id
              ? {
                  ...m,
                  content: partial,
                  _typing: !done,
                  _awaitingSync: !done,
                  ...(done ? { _fullText: undefined } : {}),
                }
              : m,
          ),
        );
      });
    },
    [speakSynced],
  );

  const resetSpoken = useCallback(() => {
    syncedIdsRef.current = new Set();
    stop();
  }, [stop]);

  useEffect(() => () => stop(), [stop]);

  return {
    isSpeaking,
    speakingMessageId,
    error,
    speak,
    speakSynced,
    toggleSpeak,
    stop,
    maybeSyncReply,
    resetSpoken,
    setError,
    unlockAudioPlayback,
  };
}

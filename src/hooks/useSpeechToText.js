import { useCallback, useEffect, useRef, useState } from 'react';
import { useAi } from '../context/AiContext';
import { useAppLanguage } from '../context/AppLanguageContext';

const TRANSCRIBE_URL = 'https://api.openai.com/v1/audio/transcriptions';

function pickRecorderMime() {
  if (typeof MediaRecorder === 'undefined') return '';
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
  ];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || '';
}

/**
 * User voice input via microphone + OpenAI Whisper (model does not speak).
 */
export function useSpeechToText() {
  const { apiKey, hasApiKey } = useAi();
  const { lang } = useAppLanguage();
  const [listening, setListening] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const handlersRef = useRef({});

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks()?.forEach((track) => track.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }, []);

  const stop = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      try {
        recorder.stop();
      } catch {
        cleanupStream();
        setListening(false);
      }
    } else {
      cleanupStream();
      setListening(false);
    }
  }, [cleanupStream]);

  const transcribe = useCallback(
    async (blob) => {
      if (!hasApiKey || !apiKey) {
        setError('Add OPENAI_API_KEY to .env to use voice.');
        return null;
      }
      if (!blob || blob.size < 100) {
        setError('No speech captured. Hold the mic and try again.');
        return null;
      }

      setTranscribing(true);
      setError(null);

      const ext = blob.type.includes('mp4') ? 'mp4' : blob.type.includes('ogg') ? 'ogg' : 'webm';
      const form = new FormData();
      form.append('file', blob, `voice.${ext}`);
      form.append('model', 'whisper-1');
      if (lang.whisperLang) {
        form.append('language', lang.whisperLang);
      }

      try {
        const response = await fetch(TRANSCRIBE_URL, {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}` },
          body: form,
        });

        if (!response.ok) {
          let message = `Voice transcription failed (${response.status})`;
          try {
            const data = await response.json();
            message = data?.error?.message || message;
          } catch {
            // ignore
          }
          throw new Error(message);
        }

        const data = await response.json();
        return String(data?.text || '').trim();
      } finally {
        setTranscribing(false);
      }
    },
    [apiKey, hasApiKey, lang.whisperLang],
  );

  const start = useCallback(
    async ({ onInterim, onFinal } = {}) => {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        setError('Microphone is not available in this browser.');
        return;
      }
      if (typeof MediaRecorder === 'undefined') {
        setError('Voice recording is not supported in this browser. Try Chrome or Edge.');
        return;
      }
      if (!hasApiKey) {
        setError('Add OPENAI_API_KEY to .env to use voice.');
        return;
      }

      handlersRef.current = { onInterim, onFinal };
      setError(null);
      chunksRef.current = [];

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const mimeType = pickRecorderMime();
        const recorder = mimeType
          ? new MediaRecorder(stream, { mimeType })
          : new MediaRecorder(stream);

        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        recorder.onerror = () => {
          setError('Microphone recording failed.');
          cleanupStream();
          setListening(false);
        };

        recorder.onstop = async () => {
          setListening(false);
          const type = recorder.mimeType || mimeType || 'audio/webm';
          const blob = new Blob(chunksRef.current, { type });
          cleanupStream();

          try {
            const text = await transcribe(blob);
            if (text) {
              handlersRef.current.onInterim?.(text);
              handlersRef.current.onFinal?.(text);
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not transcribe voice');
          }
        };

        recorder.start(250);
        setListening(true);
        handlersRef.current.onInterim?.('');
      } catch (err) {
        cleanupStream();
        setListening(false);
        const name = err && typeof err === 'object' ? err.name : '';
        setError(
          name === 'NotAllowedError' || name === 'PermissionDeniedError'
            ? 'Microphone permission denied. Allow mic access and try again.'
            : 'Could not access the microphone.',
        );
      }
    },
    [cleanupStream, hasApiKey, transcribe],
  );

  const toggle = useCallback(
    (handlers) => {
      if (listening) stop();
      else start(handlers);
    },
    [listening, start, stop],
  );

  useEffect(() => () => stop(), [stop]);

  return {
    supported: true,
    listening,
    transcribing,
    error,
    start,
    stop,
    toggle,
    setError,
  };
}

const TTS_URL = import.meta.env.DEV
  ? '/openai-api/v1/audio/speech'
  : 'https://api.openai.com/v1/audio/speech';

let audioUnlocked = false;

/** Call from a user click (Send / Mic) so later auto-play is allowed. */
export async function unlockAudioPlayback() {
  if (audioUnlocked || typeof window === 'undefined') return;
  try {
    const silent = new Audio(
      'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQQAAAA=',
    );
    silent.volume = 0.01;
    await silent.play();
    silent.pause();
    audioUnlocked = true;
  } catch {
    // still mark unlocked — browser may allow after gesture anyway
    audioUnlocked = true;
  }
}

export async function fetchOpenAiSpeech(
  apiKey,
  text,
  { voice = 'nova', model = 'tts-1' } = {},
) {
  const response = await fetch(TTS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: text.slice(0, 4096),
      voice,
      response_format: 'mp3',
    }),
  });

  if (!response.ok) {
    let message = `TTS error (${response.status})`;
    try {
      const data = await response.json();
      message = data?.error?.message || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return response.blob();
}

export function speakWithBrowser(text, lang = 'en-US') {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('Speech not supported'));
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.92;
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find((v) => v.lang?.toLowerCase().startsWith(lang.split('-')[0]));
    if (match) utterance.voice = match;
    utterance.onend = () => resolve();
    utterance.onerror = (e) => {
      if (e.error === 'interrupted' || e.error === 'canceled') resolve();
      else reject(new Error(e.error || 'Speech failed'));
    };
    window.speechSynthesis.speak(utterance);
  });
}

export function stopBrowserSpeech() {
  try {
    window.speechSynthesis?.cancel();
  } catch {
    // ignore
  }
}

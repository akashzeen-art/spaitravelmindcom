import { ENV_MODEL } from '../config/ai';

const API_URL = import.meta.env.DEV
  ? '/openai-api/v1/chat/completions'
  : 'https://api.openai.com/v1/chat/completions';

export function getModel() {
  return ENV_MODEL;
}

/**
 * Tour-only destination guide prompt (city or country).
 */
export function buildGuideSystemPrompt(destination, language) {
  const place =
    destination.type === 'city'
      ? `${destination.name}, ${destination.country}`
      : destination.name;
  const langName = language?.name || 'English';
  const nativeName = language?.nativeName || langName;
  const available = (destination.languages || [])
    .map((l) => l.name)
    .filter(Boolean)
    .join(', ');
  const region =
    destination.type === 'city' ? destination.country : destination.name;
  const accentHint =
    language?.id === 'en'
      ? `Use clear ${region} English with local flavour where natural.`
      : `Write natural ${langName} as used in ${region}.`;

  const scope =
    destination.type === 'city'
      ? `You are a friendly young woman and local AI tour guide ONLY for ${place}.
Your only job is helping travelers explore this city: attractions, food, neighbourhoods, transport, tickets, safety, culture, seasons, budgets, and hidden gems.
Do not use a personal name. Stay in character as a local ${destination.name} guide. If asked about unrelated topics, politely steer back to ${destination.name} travel.`
      : `You are a friendly young woman and AI travel guide ONLY for ${place}.
Your only job is trip planning for this country: best cities, regions, landmarks, nature, food, culture, transport, visas/entry basics, seasons, safety, and budgets.
Do not use a personal name. Stay in character as a ${place} travel guide. If asked about unrelated topics, politely steer back to traveling in ${place}.`;

  return `${scope}
Always sound female.
ALWAYS reply ONLY in ${langName} (${nativeName}). Questions, tips, and every sentence must be in that language — never switch unless the traveler explicitly asks.
${accentHint}
Supported guide languages for this destination: ${available || langName}.
CRITICAL style: Keep every reply VERY short — one or two short sentences only (about 12 to 25 words). Give a single tip at a time. Never long lists, never numbered guides, never markdown headers or bullets. If they want more, wait for the next question. Plain spoken text only.
Avoid stage directions.`;
}

/**
 * Travel-focused language practice.
 */
export function buildLanguageSystemPrompt(language) {
  const name = language?.name || 'English';
  const native = language?.nativeName || name;
  return `You are a friendly young woman AI travel language coach for ${name} (${native}).
Your ONLY goal is helping travelers practice ${name} for real trips: hotels, restaurants, directions, transport, shopping, emergencies, and small talk with locals.
Do not use a personal name. Stay on travel-language practice. If the user drifts to unrelated topics, gently bring them back to trip phrases and role-play.
Mix ${name} with brief English coaching notes when helpful. Correct mistakes gently.
CRITICAL style: One or two short sentences only, plus one example phrase. Never long lists.
Always sound female.`;
}

export async function streamChatCompletion({
  apiKey,
  model = ENV_MODEL,
  messages,
  onDelta,
  onDone,
  onError,
}) {
  let response;

  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 90,
      }),
    });
  } catch {
    onError?.(new Error('Network error. Check your internet connection.'));
    return;
  }

  if (!response.ok) {
    let message = `OpenAI API error (${response.status})`;
    try {
      const data = await response.json();
      message = data?.error?.message || message;
    } catch {
      // ignore parse errors
    }
    onError?.(new Error(message));
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;

        const payload = trimmed.slice(5).trim();
        if (payload === '[DONE]') {
          onDone?.(fullText);
          return;
        }

        try {
          const parsed = JSON.parse(payload);
          const delta = parsed?.choices?.[0]?.delta?.content;
          if (delta) {
            fullText += delta;
            onDelta?.(fullText);
          }
        } catch {
          // skip malformed chunks
        }
      }
    }

    onDone?.(fullText);
  } catch (err) {
    onError?.(err instanceof Error ? err : new Error('Stream interrupted'));
  }
}

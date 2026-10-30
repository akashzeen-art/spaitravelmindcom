import { useCallback, useRef, useState } from 'react';
import { streamChatCompletion } from '../services/openai';
import { useAi } from '../context/AiContext';

let messageId = 0;
function nextId() {
  messageId += 1;
  return `msg-${messageId}`;
}

/**
 * Chat hook — stores full reply then hands off to synced voice+text reveal.
 */
export function useAiChat(systemPrompt) {
  const { apiKey, hasApiKey, model } = useAi();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(false);

  const sendMessage = useCallback(
    async (content) => {
      const trimmed = content.trim();
      if (!trimmed || isLoading) return;

      if (!hasApiKey) {
        setError('Add OPENAI_API_KEY to .env to start chatting.');
        return;
      }

      setError(null);
      abortRef.current = false;

      const userMessage = { id: nextId(), role: 'user', content: trimmed };
      const assistantId = nextId();
      const assistantPlaceholder = {
        id: assistantId,
        role: 'assistant',
        content: '',
        _typing: true,
        _awaitingSync: false,
      };

      setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
      setIsLoading(true);

      const history = [...messages, userMessage].map(({ role, content: text }) => ({
        role,
        content: text,
      }));

      const apiMessages = [{ role: 'system', content: systemPrompt }, ...history];

      await new Promise((resolve) => {
        streamChatCompletion({
          apiKey,
          model,
          messages: apiMessages,
          onDelta: () => {},
          onDone: (text) => {
            if (abortRef.current) {
              resolve();
              return;
            }
            const fullText = (text || '').trim() || '…';
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      content: '',
                      _fullText: fullText,
                      _typing: true,
                      _awaitingSync: true,
                    }
                  : m,
              ),
            );
            setIsLoading(false);
            resolve();
          },
          onError: (err) => {
            setError(err.message);
            setMessages((prev) => prev.filter((m) => m.id !== assistantId));
            setIsLoading(false);
            resolve();
          },
        });
      });
    },
    [apiKey, hasApiKey, isLoading, messages, model, systemPrompt],
  );

  const resetChat = useCallback((greeting) => {
    abortRef.current = true;
    setIsLoading(false);
    setError(null);
    setMessages(greeting ? [{ id: nextId(), role: 'assistant', content: greeting }] : []);
  }, []);

  return { messages, setMessages, isLoading, error, sendMessage, resetChat, setError };
}

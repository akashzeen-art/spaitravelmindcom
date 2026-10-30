import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ENV_API_KEY, ENV_MODEL } from '../config/ai';

const STORAGE_KEY = 'trip-xai-api-key';

const AiContext = createContext(null);

function readStoredKey() {
  try {
    return localStorage.getItem(STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function AiProvider({ children }) {
  const [userApiKey, setUserApiKey] = useState(readStoredKey);

  const apiKey = userApiKey || ENV_API_KEY;
  const hasApiKey = Boolean(apiKey?.trim());
  const model = ENV_MODEL;

  const saveApiKey = useCallback((key) => {
    const trimmed = key.trim();
    setUserApiKey(trimmed);
    try {
      if (trimmed) {
        localStorage.setItem(STORAGE_KEY, trimmed);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const clearApiKey = useCallback(() => {
    saveApiKey('');
  }, [saveApiKey]);

  const value = useMemo(
    () => ({
      apiKey,
      hasApiKey,
      saveApiKey,
      clearApiKey,
      model,
      keySource: userApiKey ? 'local' : ENV_API_KEY ? 'env' : null,
    }),
    [apiKey, hasApiKey, saveApiKey, clearApiKey, userApiKey, model],
  );

  return <AiContext.Provider value={value}>{children}</AiContext.Provider>;
}

export function useAi() {
  const ctx = useContext(AiContext);
  if (!ctx) throw new Error('useAi must be used within AiProvider');
  return ctx;
}

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { APP_LANGS, UI } from '../i18n/ui';

const STORAGE_KEY = 'trip-xai-app-lang';
const AppLanguageContext = createContext(null);

function readStoredLang() {
  return 'es';
}

export function AppLanguageProvider({ children }) {
  const [langId, setLangIdState] = useState(readStoredLang);

  const setLangId = useCallback(() => {
    setLangIdState('es');
  }, []);

  const value = useMemo(() => {
    const lang = APP_LANGS.es;
    const t = UI.es;
    return {
      langId,
      setLangId,
      lang,
      t,
      isSpanish: langId === 'es',
    };
  }, [langId, setLangId]);

  return (
    <AppLanguageContext.Provider value={value}>{children}</AppLanguageContext.Provider>
  );
}

export function useAppLanguage() {
  const ctx = useContext(AppLanguageContext);
  if (!ctx) throw new Error('useAppLanguage must be used within AppLanguageProvider');
  return ctx;
}

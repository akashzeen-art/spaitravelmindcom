import { useAppLanguage } from '../context/AppLanguageContext';

export default function LanguageToggle({ className = '' }) {
  const { langId, setLangId, t } = useAppLanguage();

  return (
    <div
      className={`app-lang-toggle${className ? ` ${className}` : ''}`}
      role="group"
      aria-label={t.guideLanguage}
    >
      <button
        type="button"
        className="app-lang-toggle__btn is-active"
      >
        {t.spanish}
      </button>
    </div>
  );
}

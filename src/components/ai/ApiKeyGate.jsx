import { useAi } from '../../context/AiContext';

/** Banner when OpenAI browser key is missing. */
export default function ApiKeyGate() {
  const { hasApiKey, model } = useAi();

  if (hasApiKey) return null;

  return (
    <div className="ai-key-banner">
      <p>
        Conecta {model} para desbloquear esta función. Agrega <code>OPENAI_API_KEY</code> a{' '}
        <code>.env</code> y reinicia la app.
      </p>
    </div>
  );
}

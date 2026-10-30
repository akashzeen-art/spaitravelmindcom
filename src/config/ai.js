/** Env-backed AI settings (see .env: OPENAI_API_KEY, OPENAI_MODEL) */
export const ENV_API_KEY =
  import.meta.env.OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY || '';

export const ENV_MODEL =
  import.meta.env.OPENAI_MODEL || import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';

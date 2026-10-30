import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Expose OPENAI_* vars to the client
  envPrefix: ['VITE_', 'OPENAI_'],
  css: {
    devSourcemap: true,
  },
  server: {
    port: 5173,
    proxy: {
      '/openai-api': {
        target: 'https://api.openai.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/openai-api/, ''),
        secure: true,
      },
    },
  },
});

import react from '@vitejs/plugin-react';
import { defineConfig, type UserConfig } from 'vite';

// https://vite.dev/config/
const viteConfig: UserConfig = defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    proxy: {
      '/proxy-to-mfe': {
        // Default: load from the local `packages/mymfe-microfrontend-app/` dev server.
        // For local dev, you could point this at staging instead.
        // For production, you'd point the app at the real URL instead of `/proxy-to-mfe`.
        target: 'http://localhost:5173',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy-to-mfe/, ''),
      },
    },
  },
});

export default viteConfig;

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
      '/proxy-to-config': {
        // Default: load from the local `packages/myconfig-values/` dev server.
        // For local dev, you could point this at staging instead.
        // For production, you'd point the app at the real URL instead of `/proxy-to-config`.
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy-to-config/, ''),
      },
    },
  },
});

export default viteConfig;

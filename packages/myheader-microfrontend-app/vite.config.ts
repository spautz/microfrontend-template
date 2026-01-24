import { resolve } from 'node:path';
import federation from '@originjs/vite-plugin-federation';
import { ENTRY_POINTS_FOR_V1_MICROFRONTEND } from '@spautz/header-api-contracts';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Entry points must be prefixed with `./` for the federation plugin
const entryPoints = ENTRY_POINTS_FOR_V1_MICROFRONTEND.reduce<Record<string, string>>(
  (acc, identifier) => {
    acc[`./${identifier}`] = `./src/entryPoints/browser/${identifier}.tsx`;
    return acc;
  },
  {},
);

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    manifest: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        // Main entry point
        default: resolve(__dirname, 'index.html'),
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    federation({
      name: 'myheader-mfe',
      filename: 'remoteEntry-myheader.js',
      exposes: entryPoints,
      shared: {
        react: { requiredVersion: '18' },
        'react-dom': { requiredVersion: '18' },
      },
    }),
  ],
  server: {
    proxy: {
      // Remote data sources for local dev
    },
  },
});

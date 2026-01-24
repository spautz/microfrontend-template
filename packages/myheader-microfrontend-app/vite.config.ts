import { resolve } from 'node:path';
import federation from '@originjs/vite-plugin-federation';
import {
  ENTRY_POINTS_FOR_V1_MICROFRONTEND,
  entryPointValidationRegex,
} from '@spautz/header-api-contracts';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Entry points must be prefixed with `./` for this plugin
const entryPoints = ENTRY_POINTS_FOR_V1_MICROFRONTEND.reduce<Record<string, string>>(
  (acc, identifier) => {
    acc[`./${identifier}`] = `./src/entry.browser/${identifier}.tsx`;
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
        // Additional pages
        ...ENTRY_POINTS_FOR_V1_MICROFRONTEND.reduce<Record<string, string>>((acc, identifier) => {
          acc[`index-${identifier}`] = `./index-${identifier}.html`;
          acc[identifier] = `./index-${identifier}.html`;
          return acc;
        }, {}),
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
    {
      name: 'local-dev-rewrite',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          // Grab just the file-part of the filename: we don't care about extensions or slashes
          const urlToken = req.url?.match(/[^\\/.]+/);
          if (urlToken) {
            const match = urlToken[0].match(entryPointValidationRegex);
            if (match) {
              req.url = `/index-${match[0]}.html`;
            }
          }
          next();
        });
      },
    },
  ],
  server: {
    proxy: {
      // Remote data sources for local dev
    },
  },
});

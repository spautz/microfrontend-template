import { getPrerenderedHeader, getPrerenderedHeaderFromDisk } from '@spautz/header-sdk/server';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin, type UserConfigFnObject } from 'vite';

const headerMarker = '<!--prerender:header-->';
const headerLocale = null;
const microfrontendDistUrl = new URL(
  '../../packages/myheader-microfrontend-app/dist/',
  import.meta.url,
);

function prerenderHeaderVitePlugin(command: 'build' | 'serve'): Plugin {
  return {
    name: 'prerender-header',
    enforce: 'post',
    async transformIndexHtml(html) {
      if (!html.includes(headerMarker)) {
        return html;
      }

      // Acquire prerendered HTML for the header
      const headerHtml =
        command === 'build'
          ? await getPrerenderedHeaderFromDisk({
              // For local build: uses the microfrontend dist artifacts.
              baseUrl: microfrontendDistUrl,
              initialUrlPath: null,
              locale: headerLocale,
              onInitializationError: (_message, error) => {
                throw error;
              },
              onUncaughtRuntimeError: (error) => {
                throw error;
              },
            })
          : await getPrerenderedHeader({
              // For local dev: requires the microfrontend dev server to be running.
              baseUrl: new URL('http://localhost:3000/'),
              initialUrlPath: null,
              locale: headerLocale,
              onInitializationError: (_message, error) => {
                throw error;
              },
              onUncaughtRuntimeError: (error) => {
                throw error;
              },
            });
      if (headerHtml instanceof Error) {
        // We should never actually hit this line (throwing in `onUncaughtRuntimeError` should
        // cover this case already), but this explicit check makes typescript happy.
        throw headerHtml;
      }

      return html.replace(headerMarker, headerHtml);
    },
  };
}

// https://vite.dev/config/
const viteConfig: UserConfigFnObject = defineConfig(({ command }) => ({
  build: {
    sourcemap: true,
  },
  plugins: [
    prerenderHeaderVitePlugin(command),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    proxy: {
      '/proxy-to-mfe': {
        // Default: load from the local `packages/header-microfrontend-app/` dev server.
        // For local dev, you could point this at staging instead.
        // For production, you'd point the app at the real URL instead of `/proxy-to-mfe`.
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy-to-mfe/, ''),
      },
    },
  },
}));

export default viteConfig;

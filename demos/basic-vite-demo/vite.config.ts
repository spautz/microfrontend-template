import { readFile } from 'node:fs/promises';
import * as process from 'node:process';
import {
  getPrerenderedHeader,
  getRemoteEntryPointIdentifier,
  type OptionsForGetPrerenderedHeader,
} from '@spautz/myheader-sdk/server';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin, type UserConfigFnObject } from 'vite';

// The microfrontend can be loaded from either a preset address or a custom address.
// Set either `HEADER_PRESET_LOCALDEV` or `HEADER_BASEURL_LOCALDEV` to choose. Examples:
//    HEADER_PRESET_LOCALDEV=staging  npm run dev
//    HEADER_PRESET_LOCALDEV=local    npm run dev
//    HEADER_BASEURL_LOCALDEV="https://example.com/"  npm run dev
//
// Production builds will fetch from the remote address directly, with an optional local fallback.
// The local dev server proxies `/proxy-to-mfe/` to the remote address, to avoid CSP issues.

const HEADER_SOURCE_PRESETS = {
  local: 'http://localhost:3000/',
  staging: 'http://localhost:3000/',
  production: 'http://localhost:3000/',
};
const DEFAULT_HEADER_SOURCE = HEADER_SOURCE_PRESETS.local;
const ENABLE_LOCAL_FALLBACK_FOR_HEADER = true;

const headerMarkerInHtml = '<!--prerender:header-->';

// @TODO: Move this into the SDK, maybe?
function prerenderHeaderVitePlugin(pluginOptions: {
  headerBaseUrl: OptionsForGetPrerenderedHeader['baseUrl'];
  headerUrlPath: OptionsForGetPrerenderedHeader['initialUrlPath'];
  headerLocale: OptionsForGetPrerenderedHeader['locale'] | string;
  headerMarkerInHtml: string;
}): Plugin {
  const { headerBaseUrl, headerUrlPath, headerLocale, headerMarkerInHtml } = pluginOptions;

  return {
    name: 'prerender-header',
    enforce: 'post',
    async transformIndexHtml(html: string) {
      if (!html.includes(headerMarkerInHtml)) {
        this.warn(
          `basic-vite-demo expected to find a prerender marker for the header microfrontend ("${headerMarkerInHtml}") in index.html, but none was found.`,
        );
        return html;
      }
      // Make sure baseUrl is valid
      const parsedHeaderBaseUrl = new URL(headerBaseUrl).toString();
      if (parsedHeaderBaseUrl !== headerBaseUrl) {
        throw new Error(
          `headerBaseUrl "${headerBaseUrl}" did not parse cleanly: please check that it is a valid URL.`,
        );
      }

      let headerHtml: string;
      const optionsForHeaderPrerender: OptionsForGetPrerenderedHeader = {
        baseUrl: headerBaseUrl,
        initialUrlPath: headerUrlPath,
        locale: headerLocale as OptionsForGetPrerenderedHeader['locale'],
        onInitializationError: (_message: unknown, error: unknown) => {
          throw error;
        },
        onUncaughtRuntimeError: (error: unknown) => {
          throw error;
        },
      };

      try {
        headerHtml = (await getPrerenderedHeader(optionsForHeaderPrerender)) as string;
        this.info(`Using prerender from ${headerBaseUrl}`);
      } catch (error) {
        this.warn(`Could not resolve prerender from ${headerBaseUrl}: ${error}`);
        if (!ENABLE_LOCAL_FALLBACK_FOR_HEADER) {
          throw error;
        }

        this.warn('Falling back to local copy from SDK Package.');
        const entryPoint = getRemoteEntryPointIdentifier(optionsForHeaderPrerender);
        const localFallbackPrerender = import.meta.resolve(
          `@spautz/myheader-sdk/local-fallback/prerenders/${entryPoint}.html`,
        );
        headerHtml = await readFile(new URL(localFallbackPrerender), 'utf8');
      }

      return html.replace(headerMarkerInHtml, headerHtml);
    },
  };
}

// https://vite.dev/config/
const viteConfig: UserConfigFnObject = defineConfig(({ mode }) => {
  // Loads .env files for the current mode into an object.
  // Third arg "" means: do NOT filter by prefix (so you can read HEADER_PRESET_LOCALDEV, etc.).
  const env = loadEnv(mode, process.cwd(), '') as ImportMetaEnv;

  const requestedHeaderPreset = env.HEADER_PRESET_LOCALDEV;
  const requestedHeaderBaseUrl = env.HEADER_BASEURL_LOCALDEV;
  const headerLocale = env.HEADER_LOCALE || null;
  const headerUrlPath = env.HEADER_URL_PATH || null;

  // Determine baseUrl
  let headerBaseUrl: string;
  if (requestedHeaderPreset && requestedHeaderBaseUrl) {
    throw new Error(
      'Please specify either HEADER_PRESET_LOCALDEV or HEADER_BASEURL_LOCALDEV, not both.',
    );
  }

  if (requestedHeaderPreset) {
    if (!Object.hasOwn(HEADER_SOURCE_PRESETS, requestedHeaderPreset)) {
      throw new Error(
        `Invalid HEADER_PRESET_LOCALDEV: must be one of "${Object.keys(HEADER_SOURCE_PRESETS).join('", "')}".`,
      );
    }
    headerBaseUrl =
      HEADER_SOURCE_PRESETS[requestedHeaderPreset as keyof typeof HEADER_SOURCE_PRESETS];
  } else if (requestedHeaderBaseUrl) {
    const parsedUrl = new URL(requestedHeaderBaseUrl);
    if (parsedUrl.toString() !== requestedHeaderBaseUrl) {
      throw new Error(
        `HEADER_BASEURL_LOCALDEV ("${requestedHeaderBaseUrl}") did not parse cleanly: please provide a valid URL.`,
      );
    }
    headerBaseUrl = requestedHeaderBaseUrl;
  } else {
    headerBaseUrl = DEFAULT_HEADER_SOURCE;
  }

  return {
    build: {
      sourcemap: true,
    },
    plugins: [
      prerenderHeaderVitePlugin({ headerBaseUrl, headerUrlPath, headerLocale, headerMarkerInHtml }),
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
    ],
    server: {
      proxy: {
        '/proxy-to-mfe/': {
          target: headerBaseUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy-to-mfe/, ''),
        },
      },
    },
  };
});

export default viteConfig;

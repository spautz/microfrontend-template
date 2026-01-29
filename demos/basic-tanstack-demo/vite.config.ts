import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';

const HEADER_SOURCE_PRESETS = {
  local: 'http://localhost:3000/',
  staging: 'http://localhost:3000/',
  production: 'http://localhost:3000/',
};
const DEFAULT_HEADER_SOURCE = HEADER_SOURCE_PRESETS.local;

type HeaderSourceEnv = {
  HEADER_SOURCE?: string;
  HEADER_SOURCE_BASEURL?: string;
};

const resolveHeaderBaseUrl = (env: HeaderSourceEnv): string => {
  const requestedHeaderSource = env.HEADER_SOURCE;
  const requestedHeaderBaseUrl = env.HEADER_SOURCE_BASEURL;

  if (requestedHeaderSource && requestedHeaderBaseUrl) {
    throw new Error('Please specify either HEADER_SOURCE or HEADER_SOURCE_BASEURL, not both.');
  }

  if (requestedHeaderSource) {
    if (!Object.hasOwn(HEADER_SOURCE_PRESETS, requestedHeaderSource)) {
      throw new Error(
        `Invalid HEADER_SOURCE: must be one of ${Object.keys(HEADER_SOURCE_PRESETS).join(', ')}.`,
      );
    }
    return HEADER_SOURCE_PRESETS[requestedHeaderSource as keyof typeof HEADER_SOURCE_PRESETS];
  }

  return requestedHeaderBaseUrl || DEFAULT_HEADER_SOURCE;
};

const config = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '') as HeaderSourceEnv;
  const headerBaseUrl = resolveHeaderBaseUrl(env);

  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [
      devtools(),
      // this is the plugin that enables path aliases
      viteTsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
    ],
    server: {
      proxy: {
        '/proxy-to-mfe': {
          target: headerBaseUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy-to-mfe/, ''),
        },
      },
    },
  };
});

export default config;

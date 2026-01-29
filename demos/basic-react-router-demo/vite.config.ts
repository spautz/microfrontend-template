import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv, type UserConfigExport } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

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

const viteConfig: UserConfigExport = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '') as HeaderSourceEnv;
  const headerBaseUrl = resolveHeaderBaseUrl(env);

  return {
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
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

export default viteConfig;

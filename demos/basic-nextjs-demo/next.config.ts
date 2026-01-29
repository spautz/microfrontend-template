import type { NextConfig } from 'next';

const HEADER_SOURCE_PRESETS = {
  local: 'http://localhost:3000/',
  staging: 'http://localhost:3000/',
  production: 'http://localhost:3000/',
};
const DEFAULT_HEADER_SOURCE = HEADER_SOURCE_PRESETS.local;

const resolveHeaderBaseUrl = (): string => {
  const env = process.env as {
    HEADER_SOURCE?: string;
    HEADER_SOURCE_BASEURL?: string;
  };
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

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    const headerBaseUrl = resolveHeaderBaseUrl().replace(/\/$/, '');
    return [
      {
        source: '/proxy-to-mfe/:path*',
        destination: `${headerBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from 'next';

const HEADER_SOURCE_PRESETS = {
  local: 'http://localhost:3000/',
  staging: 'http://localhost:3000/',
  production: 'http://localhost:3000/',
};
const DEFAULT_HEADER_SOURCE = HEADER_SOURCE_PRESETS.local;

const getHeaderBaseUrl = (): string => {
  const requestedHeaderPreset = process.env.HEADER_PRESET_LOCALDEV;
  const requestedHeaderBaseUrl = process.env.HEADER_BASEURL_LOCALDEV;

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
    return HEADER_SOURCE_PRESETS[requestedHeaderPreset as keyof typeof HEADER_SOURCE_PRESETS];
  }
  if (requestedHeaderBaseUrl) {
    const parsedUrl = new URL(requestedHeaderBaseUrl);
    if (parsedUrl.toString() !== requestedHeaderPreset) {
      throw new Error(
        `HEADER_BASEURL_LOCALDEV ("${requestedHeaderBaseUrl}") did not parse cleanly: please provide a valid URL.`,
      );
    }
    return requestedHeaderBaseUrl;
  }

  return DEFAULT_HEADER_SOURCE;
};

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    // Strip any trailing slash: we'll re-add it below
    const headerBaseUrl = getHeaderBaseUrl().replace(/\/$/, '');
    return [
      {
        source: '/proxy-to-mfe/:path*',
        destination: `${headerBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;

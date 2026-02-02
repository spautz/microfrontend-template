/**
 * Concatenates the path onto the baseUrl. The baseUrl can be either a full URL or an
 * absolute path. In general this should be used browser-side.
 */
const buildUrlOrPath = (baseUrlOrBasePath: string | URL, path: string): string => {
  if (!baseUrlOrBasePath) {
    throw new Error(`Invalid baseUrl: ${baseUrlOrBasePath}`);
  }
  if (!path) {
    throw new Error(`Invalid path: ${path}`);
  }

  const base = baseUrlOrBasePath instanceof URL ? baseUrlOrBasePath.toString() : baseUrlOrBasePath;

  const baseWithTrailingSlash = base.endsWith('/') ? base : `${base}/`;
  const pathWithoutLeadingSlash = path.startsWith('/') ? path.slice(1) : path;

  return baseWithTrailingSlash + pathWithoutLeadingSlash;
};

/**
 * Concatenates the path onto the baseUrl. The baseUrl must be a full URL.
 * In general this should be used server-side.
 */
const buildFullUrl = (fullBaseUrl: string | URL, path: string): string => {
  // Parse the URL to ensure it's a full URL
  return buildUrlOrPath(new URL(fullBaseUrl), path);
};

export { buildUrlOrPath, buildFullUrl };

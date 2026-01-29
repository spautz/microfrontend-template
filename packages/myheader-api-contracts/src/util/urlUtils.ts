const normalizeBaseUrl = (baseUrl: string | URL): string => {
  if (!baseUrl) {
    return baseUrl;
  }
  const baseUrlString = baseUrl.toString();

  return baseUrlString.endsWith('/') ? baseUrlString : `${baseUrlString}/`;
};

const normalizePath = (path: string): string => (path.startsWith('/') ? path.slice(1) : path);

const buildUrl = (path: string, baseUrl: string | URL): URL => {
  return new URL(normalizePath(path), normalizeBaseUrl(baseUrl));
};

const buildUrlString = (path: string, baseUrl: string | URL): string =>
  buildUrl(path, baseUrl).toString();

export { buildUrl, buildUrlString };

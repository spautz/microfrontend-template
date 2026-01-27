import type { V1FetchParams, V1Header_PrerenderOptions } from '@spautz/header-api-contracts/v1';
import { convertV1FetchParamsToEntryPoint } from '@spautz/header-api-contracts/v1';

const normalizeBaseUrl = (baseUrl: string | URL): URL => {
  const url = new URL(baseUrl);
  if (!url.pathname.endsWith('/')) {
    // Ensure relative URL resolution treats baseUrl like a directory.
    url.pathname = `${url.pathname}/`;
  }
  return url;
};

const buildPrerenderedHeaderUrl = (
  baseUrl: string | URL,
  fetchParams: V1FetchParams,
  prerenderOptions: V1Header_PrerenderOptions,
): URL => {
  const entryPointIdentifier = convertV1FetchParamsToEntryPoint(fetchParams);
  const prerenderUrl = new URL(
    `prerenders/${entryPointIdentifier}.html`,
    normalizeBaseUrl(baseUrl),
  );

  if (prerenderOptions.initialUrlPath != null) {
    prerenderUrl.searchParams.set('initialUrlPath', prerenderOptions.initialUrlPath);
  }

  return prerenderUrl;
};

export { buildPrerenderedHeaderUrl };

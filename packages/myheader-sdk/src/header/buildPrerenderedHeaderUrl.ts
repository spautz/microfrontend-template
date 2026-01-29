import {
  buildUrl,
  convertV1FetchParamsToEntryPoint,
  type V1FetchParams,
  type V1Header_PrerenderOptions,
} from '@spautz/header-api-contracts/v1';

const buildPrerenderedHeaderUrl = (
  baseUrl: string | URL,
  fetchParams: V1FetchParams,
  prerenderOptions: V1Header_PrerenderOptions,
): URL => {
  const entryPointIdentifier = convertV1FetchParamsToEntryPoint(fetchParams);
  const prerenderUrl = new URL(buildUrl(`prerenders/${entryPointIdentifier}.html`, baseUrl));

  if (prerenderOptions.initialUrlPath != null) {
    prerenderUrl.searchParams.set('initialUrlPath', prerenderOptions.initialUrlPath);
  }

  return prerenderUrl;
};

export { buildPrerenderedHeaderUrl };

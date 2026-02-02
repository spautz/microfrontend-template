import {
  buildFullUrl,
  convertV1FetchParamsToEntryPoint,
  type V1FetchParams,
  type V1Header_PrerenderOptions,
} from '@spautz/myheader-api-contracts/v1';

const buildPrerenderedHeaderUrl = (
  baseUrl: string | URL,
  fetchParams: V1FetchParams,
  _prerenderOptions: V1Header_PrerenderOptions,
): string => {
  const entryPointIdentifier = convertV1FetchParamsToEntryPoint(fetchParams);
  const prerenderUrl = buildFullUrl(baseUrl, `prerenders/${entryPointIdentifier}.html`);
  return prerenderUrl;
};

export { buildPrerenderedHeaderUrl };

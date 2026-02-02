import {
  buildFullUrl,
  convertV1FetchParamsToEntryPoint,
  type V1FetchParams,
  type V1Header_PrerenderOptions,
  type V1Header_PrerenderReturn,
} from '@spautz/myheader-api-contracts/v1';

import {
  type InitializationAndFetchParams,
  separateFetchParamsFromOtherOptions,
} from '../resolveRemoteEntry.ts';
import { convertCaughtValueToError } from '../utils.ts';

const buildPrerenderedHeaderHTMLPath = (fetchParams: V1FetchParams): string => {
  const entryPointIdentifier = convertV1FetchParamsToEntryPoint(fetchParams);
  return `prerenders/${entryPointIdentifier}.html`;
};

const buildPrerenderedHeaderHTMLUrl = (
  baseUrl: string | URL,
  fetchParams: V1FetchParams,
): string => {
  return buildFullUrl(baseUrl, buildPrerenderedHeaderHTMLPath(fetchParams));
};

// This should be `baseUrl` + `fetchParams` + the options for v1Header_prerender()
// The keys are duplicated here (instead of inherited from those places) so that we'll get
// an error if something changes unexpectedly.
type OptionsForGetHeaderPrerenderHTML = InitializationAndFetchParams & V1Header_PrerenderOptions;

const getHeaderPrerenderHTML = async (
  options: OptionsForGetHeaderPrerenderHTML,
): Promise<V1Header_PrerenderReturn | null> => {
  const [initializationParams, fetchParams, _prerenderOptions] =
    separateFetchParamsFromOtherOptions(options);
  const { baseUrl, onInitializationError } = initializationParams;

  try {
    if (typeof fetch !== 'function') {
      throw new Error('Global fetch is not available in this runtime.');
    }

    const prerenderUrl = buildPrerenderedHeaderHTMLUrl(baseUrl, fetchParams);

    const response = await fetch(prerenderUrl);
    if (!response.ok) {
      throw new Error(`Prerender fetch failed: ${response.status} ${response.statusText}`);
    }

    return await response.text();
  } catch (err: unknown) {
    onInitializationError(convertCaughtValueToError(err), 'Could not fetch prerendered header');
    return null;
  }
};

export type { OptionsForGetHeaderPrerenderHTML };
export { buildPrerenderedHeaderHTMLPath, buildPrerenderedHeaderHTMLUrl, getHeaderPrerenderHTML };

import {
  buildFullUrl,
  convertV1FetchParamsToEntryPoint,
  type V1FetchParams,
} from '@spautz/mfeheader-api-contracts/v1';
import {
  type InitializationAndFetchParams,
  separateFetchParamsFromOtherOptions,
} from '../resolveRemoteEntry.ts';
import { convertCaughtValueToError } from '../utils.ts';

const buildHeaderAssetsPrefetchHTMLPath = (fetchParams: V1FetchParams): string => {
  const entryPointIdentifier = convertV1FetchParamsToEntryPoint(fetchParams);
  return `asset-include/${entryPointIdentifier}-prefetch.html`;
};

const buildHeaderAssetsPrefetchHTMLUrl = (
  baseUrl: string | URL,
  fetchParams: V1FetchParams,
): string => {
  return buildFullUrl(baseUrl, buildHeaderAssetsPrefetchHTMLPath(fetchParams));
};

type OptionsForGetHeaderAssetsPrefetchHTML = InitializationAndFetchParams;

const getHeaderAssetsPrefetchHTML = async (
  options: OptionsForGetHeaderAssetsPrefetchHTML,
): Promise<string | null> => {
  const [initializationParams, fetchParams, _prerenderOptions] =
    separateFetchParamsFromOtherOptions(options);
  const { baseUrl, onInitializationError } = initializationParams;

  try {
    if (typeof fetch !== 'function') {
      throw new Error('Global fetch is not available in this runtime.');
    }

    const assetsUrl = buildHeaderAssetsPrefetchHTMLUrl(baseUrl, fetchParams);

    const response = await fetch(assetsUrl);
    if (!response.ok) {
      throw new Error(
        `Header assets prefetch HTML fetch failed: ${response.status} ${response.statusText}`,
      );
    }

    const rawHtml = await response.text();
    // Transform all URLS to be absolute, since we don't know the base URL of the consumer's page
    // @TODO: Move this to mfe-utils
    const baseUrlString = baseUrl.toString();
    const baseUrlWithoutTrailingSlash = baseUrlString.endsWith('/')
      ? baseUrlString.substring(0, baseUrlString.length - 1)
      : baseUrlString;
    const transformedHtml = rawHtml.replaceAll('{{$BASE_URL}}', baseUrlWithoutTrailingSlash);
    return transformedHtml;
  } catch (err: unknown) {
    onInitializationError(
      convertCaughtValueToError(err),
      'Could not fetch header assets prefetch HTML',
    );
    return null;
  }
};

export type { OptionsForGetHeaderAssetsPrefetchHTML };
export {
  buildHeaderAssetsPrefetchHTMLPath,
  buildHeaderAssetsPrefetchHTMLUrl,
  getHeaderAssetsPrefetchHTML,
};

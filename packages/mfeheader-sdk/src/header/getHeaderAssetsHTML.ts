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

const buildHeaderAssetsHTMLPath = (fetchParams: V1FetchParams): string => {
  const entryPointIdentifier = convertV1FetchParamsToEntryPoint(fetchParams);
  return `asset-include/${entryPointIdentifier}-head.html`;
};

const buildHeaderAssetsHTMLUrl = (baseUrl: string | URL, fetchParams: V1FetchParams): string => {
  return buildFullUrl(baseUrl, buildHeaderAssetsHTMLPath(fetchParams));
};

type OptionsForGetHeaderAssetsHTML = InitializationAndFetchParams;

const getHeaderAssetsHTML = async (
  options: OptionsForGetHeaderAssetsHTML,
): Promise<string | null> => {
  const [initializationParams, fetchParams] = separateFetchParamsFromOtherOptions(options);
  const { baseUrl, onInitializationError } = initializationParams;

  try {
    if (typeof fetch !== 'function') {
      throw new Error('Global fetch is not available in this runtime.');
    }

    const assetsUrl = buildHeaderAssetsHTMLUrl(baseUrl, fetchParams);

    const response = await fetch(assetsUrl);
    if (!response.ok) {
      throw new Error(`Header assets HTML fetch failed: ${response.status} ${response.statusText}`);
    }

    return await response.text();
  } catch (err: unknown) {
    onInitializationError(convertCaughtValueToError(err), 'Could not fetch header assets HTML');
    return null;
  }
};

export type { OptionsForGetHeaderAssetsHTML };
export { buildHeaderAssetsHTMLPath, buildHeaderAssetsHTMLUrl, getHeaderAssetsHTML };

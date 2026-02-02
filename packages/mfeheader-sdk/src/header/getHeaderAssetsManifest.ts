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

type ManifestPayload = {
  css?: Array<string>;
  js?: Array<string>;
};

const buildHeaderAssetsManifestPath = (fetchParams: V1FetchParams): string => {
  const entryPointIdentifier = convertV1FetchParamsToEntryPoint(fetchParams);
  return `asset-include/${entryPointIdentifier}-manifest.json`;
};

const buildHeaderAssetsManifestUrl = (
  baseUrl: string | URL,
  fetchParams: V1FetchParams,
): string => {
  return buildFullUrl(baseUrl, buildHeaderAssetsManifestPath(fetchParams));
};

type OptionsForGetHeaderAssetsManifest = InitializationAndFetchParams;

const getHeaderAssetsManifest = async (
  options: OptionsForGetHeaderAssetsManifest,
): Promise<ManifestPayload | null> => {
  const [initializationParams, fetchParams] = separateFetchParamsFromOtherOptions(options);
  const { baseUrl, onInitializationError } = initializationParams;

  try {
    if (typeof fetch !== 'function') {
      throw new Error('Global fetch is not available in this runtime.');
    }

    const manifestUrl = buildHeaderAssetsManifestUrl(baseUrl, fetchParams);

    const response = await fetch(manifestUrl);
    if (!response.ok) {
      throw new Error(
        `Header assets manifest fetch failed: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (err: unknown) {
    onInitializationError(convertCaughtValueToError(err), 'Could not fetch header assets manifest');
    return null;
  }
};

export type { OptionsForGetHeaderAssetsManifest };
export { buildHeaderAssetsManifestPath, buildHeaderAssetsManifestUrl, getHeaderAssetsManifest };

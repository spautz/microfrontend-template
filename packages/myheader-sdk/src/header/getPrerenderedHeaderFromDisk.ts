import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

import type {
  V1Header_PrerenderOptions,
  V1Header_PrerenderReturn,
} from '@spautz/header-api-contracts/v1';

import {
  type SDKEntryAndFetchParams,
  separateFetchParamsFromOtherOptions,
} from '../resolveRemoteEntry.ts';
import { convertCaughtValueToError } from '../utils.ts';
import { buildPrerenderedHeaderUrl } from './buildPrerenderedHeaderUrl.ts';

// This should be `baseUrl` + `fetchParams` + the options for v1Header_prerender()
// The keys are duplicated here (instead of inherited from those places) so that we'll get
// an error if something changes unexpectedly.
type AllGetPrerenderedHeaderFromDiskOptions = SDKEntryAndFetchParams & V1Header_PrerenderOptions;

const coerceBaseUrlToFileUrl = (baseUrl: string | URL): URL => {
  if (baseUrl instanceof URL) {
    return baseUrl;
  }

  try {
    return new URL(baseUrl);
  } catch {
    return pathToFileURL(baseUrl);
  }
};

const getPrerenderedHeaderFromDisk = async (
  options: AllGetPrerenderedHeaderFromDiskOptions,
): Promise<V1Header_PrerenderReturn | Error> => {
  const [sdkEntryParams, fetchParams, prerenderOptions] =
    separateFetchParamsFromOtherOptions(options);
  const { baseUrl, onInitializationError } = sdkEntryParams;

  try {
    const baseUrlAsUrl = coerceBaseUrlToFileUrl(baseUrl);
    if (baseUrlAsUrl.protocol !== 'file:') {
      throw new Error(
        `Disk prerender requires a file URL baseUrl. Received: ${baseUrlAsUrl.protocol}`,
      );
    }

    const prerenderUrl = buildPrerenderedHeaderUrl(baseUrlAsUrl, fetchParams, prerenderOptions);
    // On-disk prerenders do not vary by query params yet.
    prerenderUrl.search = '';
    prerenderUrl.hash = '';

    const filePath = fileURLToPath(prerenderUrl);
    return await readFile(filePath, 'utf8');
  } catch (err: unknown) {
    const error = convertCaughtValueToError(err);
    onInitializationError('Could not read prerendered header from disk', error);
    return error;
  }
};

export { getPrerenderedHeaderFromDisk };

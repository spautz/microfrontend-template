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
type OptionsForGetPrerenderedHeader = SDKEntryAndFetchParams & V1Header_PrerenderOptions;

const getPrerenderedHeader = async (
  options: OptionsForGetPrerenderedHeader,
): Promise<V1Header_PrerenderReturn | Error> => {
  const [sdkEntryParams, fetchParams, prerenderOptions] =
    separateFetchParamsFromOtherOptions(options);
  const { baseUrl, onInitializationError } = sdkEntryParams;

  try {
    if (typeof fetch !== 'function') {
      throw new Error('Global fetch is not available in this runtime.');
    }

    const prerenderUrl = buildPrerenderedHeaderUrl(baseUrl, fetchParams, prerenderOptions);

    const response = await fetch(prerenderUrl.toString());
    if (!response.ok) {
      throw new Error(`Prerender fetch failed: ${response.status} ${response.statusText}`);
    }

    return await response.text();
  } catch (err: unknown) {
    const error = convertCaughtValueToError(err);
    onInitializationError('Could not fetch prerendered header', error);
    return error;
  }
};

export type { OptionsForGetPrerenderedHeader };
export { getPrerenderedHeader };

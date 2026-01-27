import type {
  V1Header_PrerenderOptions,
  V1Header_PrerenderReturn,
} from '@spautz/header-api-contracts/v1';

import {
  resolveRemoteEntry,
  type SDKEntryAndFetchParams,
  separateFetchParamsFromOtherOptions,
} from '../resolveRemoteEntry.ts';
import { convertCaughtValueToError } from '../utils.ts';

// This should be `baseUrl` + `fetchParams` + the options for v1Header_prerender()
// The keys are duplicated here (instead of inherited from those places) so that we'll get
// an error if something changes unexpectedly.
type AllPrerenderHeaderOptions = SDKEntryAndFetchParams & V1Header_PrerenderOptions;

const prerenderHeader = async (
  options: AllPrerenderHeaderOptions,
): Promise<V1Header_PrerenderReturn | Error> => {
  const browserEntry = await resolveRemoteEntry(options);

  const [sdkEntryParams, , prerenderOptions] = separateFetchParamsFromOtherOptions(options);
  const { onUncaughtRuntimeError } = sdkEntryParams;

  // Once resolved, pass along the remaining options to render
  let error: Error;
  try {
    return browserEntry.v1Header_prerender(prerenderOptions);
  } catch (err: unknown) {
    error = convertCaughtValueToError(err);
    onUncaughtRuntimeError(error);
    return error;
  }
};

export { prerenderHeader };

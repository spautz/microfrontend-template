import type {
  V1Header_RehydrateOptions,
  V1Header_RehydrateReturn,
} from '@spautz/header-api-contracts/v1';

import {
  type ClientInitializationAndFetchParams,
  resolveRemoteEntry,
  separateFetchParamsFromOtherOptions,
} from '../resolveRemoteEntry.ts';
import { convertCaughtValueToError } from '../utils.ts';

// This should be `baseUrl` + `fetchParams` + the options for v1Header_rehydrate()
// The keys are duplicated here (instead of inherited from those places) so that we'll get
// an error if something changes unexpectedly.
type AllRehydrateHeaderOptions = ClientInitializationAndFetchParams & V1Header_RehydrateOptions;

const rehydrateHeader = async (
  options: AllRehydrateHeaderOptions,
): Promise<V1Header_RehydrateReturn | Error> => {
  const browserEntry = await resolveRemoteEntry(options);

  const [initializationParams, , rehydrateOptions] = separateFetchParamsFromOtherOptions(options);
  const { onUncaughtRuntimeError } = initializationParams;

  // Once resolved, pass along the remaining options to render
  let error: Error;
  try {
    return browserEntry.v1Header_rehydrate(rehydrateOptions);
  } catch (err: unknown) {
    error = convertCaughtValueToError(err);
    onUncaughtRuntimeError(error);
    return error;
  }
};

export { rehydrateHeader };

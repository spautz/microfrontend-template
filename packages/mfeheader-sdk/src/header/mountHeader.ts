import type {
  V1Header_MountOptions,
  V1Header_MountReturn,
} from '@spautz/mfeheader-api-contracts/v1';

import {
  type InitializationAndFetchParams,
  resolveRemoteEntry,
  separateFetchParamsFromOtherOptions,
} from '../resolveRemoteEntry.ts';
import { convertCaughtValueToError } from '../utils.ts';

// This should be `baseUrl` + `fetchParams` + the options for v1Header_mount()
// The keys are duplicated here (instead of inherited from those places) so that we'll get
// an error if something changes unexpectedly.
type AllMountHeaderOptions = InitializationAndFetchParams & V1Header_MountOptions;

const mountHeader = async (
  options: AllMountHeaderOptions,
): Promise<V1Header_MountReturn | null> => {
  const browserEntry = await resolveRemoteEntry(options);

  const [initializationParams, , mountOptions] = separateFetchParamsFromOtherOptions(options);
  const { onUncaughtRuntimeError } = initializationParams;

  // Once resolved, pass along the remaining options to render
  let error: Error;
  try {
    return browserEntry.v1Header_mount(mountOptions);
  } catch (err: unknown) {
    error = convertCaughtValueToError(err);
    onUncaughtRuntimeError(error);
    return null;
  }
};

export { mountHeader };

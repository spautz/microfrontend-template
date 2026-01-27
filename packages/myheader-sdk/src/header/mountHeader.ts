import type { V1Header_MountOptions, V1Header_MountReturn } from '@spautz/header-api-contracts/v1';

import {
  resolveRemoteEntry,
  type SDKEntryAndFetchParams,
  separateFetchParamsFromOtherOptions,
} from '../resolveRemoteEntry.ts';

// This should be `baseUrl` + `fetchParams` + the options for v1Header_mount()
// The keys are duplicated here (instead of inherited from those places) so that we'll get
// an error if something changes unexpectedly.
type AllMountHeaderOptions = SDKEntryAndFetchParams & V1Header_MountOptions;

const mountHeader = async (options: AllMountHeaderOptions): Promise<V1Header_MountReturn> => {
  const browserEntry = await resolveRemoteEntry(options);

  const [, , mountOptions] = separateFetchParamsFromOtherOptions(options);

  // Once resolved, pass along the remaining options to render
  return browserEntry.v1Header_mount(mountOptions);
};

export { mountHeader };

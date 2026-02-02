import {
  buildUrlOrPath,
  REMOTE_MODULE_CONTAINER_FILENAME,
} from '@spautz/myheader-api-contracts/v1';
import type { InitializationParams } from './resolveRemoteEntry.ts';

/**
 * The module federation container used by the microfrontend-app
 */
type RemoteEntryContainer = {
  get: (entryPoint: string) => Promise<() => Promise<unknown> | unknown>;
  init?: (shareScope: Record<string, unknown>) => void | Promise<void>;
};

const REMOTE_ENTRY_FILENAME = `assets/${REMOTE_MODULE_CONTAINER_FILENAME}`;

// const getShareScope = (): Record<string, unknown> =>
//   (globalThis as { __federation_shared__?: Record<string, unknown> }).__federation_shared__ ?? {};

/**
 * If a consumer's build system can't/won't ignore pass through dynamic imports from packages,
 * the consumer has to inject their own `import()` resolver instead of using this default.
 * For that case, this default needs to *not* be detected as an `import()` by their build system.
 * Wrapping it up as a `new Function()` just obfuscates it.
 */
const runtimeImport = new Function('url', 'return import(url)') as (
  url: string,
) => Promise<unknown>;

const doDynamicImport_default = (url: string) => runtimeImport(url);

const loadRemoteEntryContainer = async (
  initializationParams: InitializationParams,
): Promise<RemoteEntryContainer> => {
  const { baseUrl, doDynamicImport, sharedDependencies } = initializationParams;

  const remoteEntryUrl = buildUrlOrPath(baseUrl, REMOTE_ENTRY_FILENAME);
  const containerPromise = (doDynamicImport || doDynamicImport_default)(
    remoteEntryUrl,
  ) as Promise<RemoteEntryContainer>;
  const container = await containerPromise;

  if (typeof container.init === 'function' && sharedDependencies) {
    // await container.init(getShareScope());
    await container.init(sharedDependencies);
  }

  return container;
};

export type { RemoteEntryContainer };
export { loadRemoteEntryContainer };

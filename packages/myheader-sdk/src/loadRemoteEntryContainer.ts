import { buildUrlString, REMOTE_MODULE_CONTAINER_FILENAME } from '@spautz/header-api-contracts/v1';

/**
 * The module federation container used by the microfrontend-app
 */
type RemoteEntryContainer = {
  get: (entryPoint: string) => Promise<() => Promise<unknown> | unknown>;
  init?: (shareScope: Record<string, unknown>) => void | Promise<void>;
};

const REMOTE_ENTRY_FILENAME = `assets/${REMOTE_MODULE_CONTAINER_FILENAME}`;

const getShareScope = (): Record<string, unknown> =>
  (globalThis as { __federation_shared__?: Record<string, unknown> }).__federation_shared__ ?? {};

const loadRemoteEntryContainer = async (baseUrl: string | URL): Promise<RemoteEntryContainer> => {
  const remoteEntryUrl = buildUrlString(REMOTE_ENTRY_FILENAME, baseUrl);
  const container = (await import(
    /* @vite-ignore */ /* webpackIgnore: true */ remoteEntryUrl
  )) as RemoteEntryContainer;

  if (typeof container.init === 'function') {
    await container.init(getShareScope());
  }

  return container;
};

export type { RemoteEntryContainer };
export { loadRemoteEntryContainer };

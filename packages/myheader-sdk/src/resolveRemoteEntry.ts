import {
  convertV1FetchParamsToEntryPoint,
  REMOTE_MODULE_FILENAME,
  type V1FetchParams,
  type V1Render,
} from '@spautz/header-api-contracts';

/**
 * The module federation container used by the microfrontend-app
 */
type RemoteEntryModule = {
  get: (entryPoint: string) => Promise<() => Promise<unknown> | unknown>;
  init?: (shareScope: Record<string, unknown>) => void | Promise<void>;
};

type BrowserEntryModule = {
  v1Render: V1Render;
};

const REMOTE_ENTRY_FILENAME = `assets/${REMOTE_MODULE_FILENAME}`;

const getShareScope = (): Record<string, unknown> =>
  (globalThis as { __federation_shared__?: Record<string, unknown> }).__federation_shared__ ?? {};

const loadRemoteEntryContainer = async (baseUrl: string | URL): Promise<RemoteEntryModule> => {
  const remoteEntryUrl = new URL(REMOTE_ENTRY_FILENAME, baseUrl).toString();
  const container = (await import(
    /* @vite-ignore */ /* webpackIgnore: true */ remoteEntryUrl
  )) as RemoteEntryModule;

  if (typeof container.init === 'function') {
    await container.init(getShareScope());
  }

  return container;
};

const resolveRemoteEntry = async (
  baseUrl: string | URL,
  fetchParams?: V1FetchParams,
): Promise<BrowserEntryModule> => {
  const entryPointIdentifier = convertV1FetchParamsToEntryPoint(fetchParams ?? {});
  const entryPoint = `./${entryPointIdentifier}`;
  const container = await loadRemoteEntryContainer(baseUrl);
  const factory = await container.get(entryPoint);
  const module = await factory();
  return module as BrowserEntryModule;
};

export { resolveRemoteEntry };

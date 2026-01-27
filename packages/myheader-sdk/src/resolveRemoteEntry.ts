import {
  convertV1FetchParamsToEntryPoint,
  REMOTE_MODULE_CONTAINER_FILENAME,
  type V1FetchParams,
  type V1Header_MountOptions,
  type V1Header_MountReturn,
  type V1Header_RehydrateOptions,
  type V1Header_RehydrateReturn,
} from '@spautz/header-api-contracts/v1';

/**
 * Parameters for resolving the microfrontend-app's top-level container.
 * All top-level functions exported by the SDK should accept these
 * (in the same options object as FetchParams and any function-specific options)
 */
type SDKEntryParams = {
  baseUrl: string | URL;
  onInitializationError: (message: string, error?: Error) => void;
  sharedDependencies?: Record<string, unknown>;
};

type SDKEntryAndFetchParams = SDKEntryParams & V1FetchParams;
type OtherOptions<T extends SDKEntryAndFetchParams> = Omit<
  T,
  keyof SDKEntryParams | keyof V1FetchParams
>;

/**
 * The module federation container used by the microfrontend-app
 */
type RemoteEntryModule = {
  get: (entryPoint: string) => Promise<() => Promise<unknown> | unknown>;
  init?: (shareScope: Record<string, unknown>) => void | Promise<void>;
};

type BrowserEntryModule = {
  v1Header_mount: (options: V1Header_MountOptions) => V1Header_MountReturn;
  v1Header_rehydrate?: (options: V1Header_RehydrateOptions) => V1Header_RehydrateReturn;
};

const REMOTE_ENTRY_FILENAME = `assets/${REMOTE_MODULE_CONTAINER_FILENAME}`;

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

const separateFetchParamsFromOtherOptions = <T extends SDKEntryAndFetchParams>(
  allOptions: T,
): [SDKEntryParams, V1FetchParams, OtherOptions<T>] => {
  const {
    baseUrl,
    onInitializationError,
    locale = null,
    sharedDependencies = {},
    ...otherOptions
  } = allOptions;
  const sdkEntryParams = { baseUrl, onInitializationError, sharedDependencies };
  const fetchParams = { locale };

  return [sdkEntryParams, fetchParams, otherOptions];
};

type RemoteEntryLoader = (baseUrl: string | URL) => Promise<RemoteEntryModule>;

const resolveRemoteEntry = async (
  allOptions: SDKEntryAndFetchParams,
  loadRemoteEntry: RemoteEntryLoader = loadRemoteEntryContainer,
): Promise<BrowserEntryModule> => {
  const [sdkEntryParams, fetchParams] = separateFetchParamsFromOtherOptions(allOptions);

  const {
    baseUrl,
    onInitializationError,
    sharedDependencies: _sharedDependencies,
  } = sdkEntryParams;

  try {
    const entryPointIdentifier = convertV1FetchParamsToEntryPoint(fetchParams);
    const entryPoint = `./${entryPointIdentifier}`;

    const container = await loadRemoteEntry(baseUrl);
    const factory = await container.get(entryPoint);

    const module = await factory();
    return module as BrowserEntryModule;
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error(String(e));
    onInitializationError('Could not resolve remote entry', error);
    throw error;
  }
};

export type { SDKEntryParams, SDKEntryAndFetchParams };
export { loadRemoteEntryContainer, resolveRemoteEntry, separateFetchParamsFromOtherOptions };

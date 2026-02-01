import {
  convertV1FetchParamsToEntryPoint,
  type V1FetchParams,
  type V1Header_MountOptions,
  type V1Header_MountReturn,
  type V1Header_PrerenderOptions,
  type V1Header_PrerenderReturn,
  type V1Header_RehydrateOptions,
  type V1Header_RehydrateReturn,
} from '@spautz/myheader-api-contracts/v1';
import { ensureHeaderStyles } from './header/ensureHeaderStyles.ts';
import { loadRemoteEntryContainer } from './loadRemoteEntryContainer.ts';
import { convertCaughtValueToError } from './utils.ts';

/**
 * Parameters for resolving the microfrontend-app's top-level container.
 * All top-level functions exported by the SDK should accept these
 * (in the same options object as FetchParams and any function-specific options)
 */
type InitializationParams = {
  baseUrl: string | URL;
  onInitializationError: (message: string, error?: Error) => void;
  onUncaughtRuntimeError: (error?: Error) => void;
  sharedDependencies?: Record<string, unknown>;
};

type InitializationAndFetchParams = InitializationParams & V1FetchParams;

type ExportsFromRemoteEntryModule = {
  v1Header_mount: (options: V1Header_MountOptions) => V1Header_MountReturn;
  v1Header_rehydrate: (options: V1Header_RehydrateOptions) => V1Header_RehydrateReturn;
  v1Header_prerender: (options: V1Header_PrerenderOptions) => V1Header_PrerenderReturn;
};

const separateFetchParamsFromOtherOptions = <T extends InitializationAndFetchParams>(
  allOptions: T,
): [
  InitializationParams,
  V1FetchParams,
  Omit<T, keyof InitializationParams | keyof V1FetchParams>,
] => {
  const {
    baseUrl,
    onInitializationError,
    onUncaughtRuntimeError,
    locale = null,
    sharedDependencies = {},
    ...otherOptions
  } = allOptions;
  const initializationParams = {
    baseUrl,
    onInitializationError,
    onUncaughtRuntimeError,
    sharedDependencies,
  };
  const fetchParams = { locale };

  return [initializationParams, fetchParams, otherOptions];
};

const resolveRemoteEntry = async (
  allOptions: InitializationAndFetchParams,
): Promise<ExportsFromRemoteEntryModule> => {
  const [initializationParams, fetchParams] = separateFetchParamsFromOtherOptions(allOptions);

  const {
    baseUrl,
    onInitializationError,
    sharedDependencies: _sharedDependencies,
  } = initializationParams;

  try {
    const entryPointIdentifier = convertV1FetchParamsToEntryPoint(fetchParams);
    await ensureHeaderStyles({ baseUrl, entryPointIdentifier }).catch((error) => {
      onInitializationError('Could not preload header styles', error);
    });
    const entryPoint = `./${entryPointIdentifier}`;

    const container = await loadRemoteEntryContainer(baseUrl);
    const factory = await container.get(entryPoint);

    const module = await factory();
    return module as ExportsFromRemoteEntryModule;
  } catch (err: unknown) {
    const error = convertCaughtValueToError(err);
    onInitializationError('Could not resolve remote entry', error);
    throw error;
  }
};

const getRemoteEntryPointIdentifier = (options: V1FetchParams) => {
  const [, fetchParams] = separateFetchParamsFromOtherOptions(
    options as InitializationAndFetchParams,
  );
  return convertV1FetchParamsToEntryPoint(fetchParams);
};

export type { InitializationParams, InitializationAndFetchParams };
export {
  getRemoteEntryPointIdentifier,
  loadRemoteEntryContainer,
  resolveRemoteEntry,
  separateFetchParamsFromOtherOptions,
};

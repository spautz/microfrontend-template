import {
  convertV1FetchParamsToEntryPoint,
  type V1FetchParams,
  type V1Header_MountOptions,
  type V1Header_MountReturn,
  type V1Header_PrerenderOptions,
  type V1Header_PrerenderReturn,
  type V1Header_RehydrateOptions,
  type V1Header_RehydrateReturn,
} from '@spautz/header-api-contracts/v1';
import { loadRemoteEntryContainer } from './loadRemoteEntryContainer.ts';
import { convertCaughtValueToError } from './utils.ts';

/**
 * Parameters for resolving the microfrontend-app's top-level container.
 * All top-level functions exported by the SDK should accept these
 * (in the same options object as FetchParams and any function-specific options)
 */
type SDKEntryParams = {
  baseUrl: string | URL;
  onInitializationError: (message: string, error?: Error) => void;
  onUncaughtRuntimeError: (error?: Error) => void;
  sharedDependencies?: Record<string, unknown>;
};

type SDKEntryAndFetchParams = SDKEntryParams & V1FetchParams;
type OtherOptions<T extends SDKEntryAndFetchParams> = Omit<
  T,
  keyof SDKEntryParams | keyof V1FetchParams
>;

type ExportsFromRemoteEntryModule = {
  v1Header_mount: (options: V1Header_MountOptions) => V1Header_MountReturn;
  v1Header_rehydrate: (options: V1Header_RehydrateOptions) => V1Header_RehydrateReturn;
  v1Header_prerender: (options: V1Header_PrerenderOptions) => V1Header_PrerenderReturn;
};

const separateFetchParamsFromOtherOptions = <T extends SDKEntryAndFetchParams>(
  allOptions: T,
): [SDKEntryParams, V1FetchParams, OtherOptions<T>] => {
  const {
    baseUrl,
    onInitializationError,
    onUncaughtRuntimeError,
    locale = null,
    sharedDependencies = {},
    ...otherOptions
  } = allOptions;
  const sdkEntryParams = {
    baseUrl,
    onInitializationError,
    onUncaughtRuntimeError,
    sharedDependencies,
  };
  const fetchParams = { locale };

  return [sdkEntryParams, fetchParams, otherOptions];
};

const resolveRemoteEntry = async (
  allOptions: SDKEntryAndFetchParams,
): Promise<ExportsFromRemoteEntryModule> => {
  const [sdkEntryParams, fetchParams] = separateFetchParamsFromOtherOptions(allOptions);

  const {
    baseUrl,
    onInitializationError,
    sharedDependencies: _sharedDependencies,
  } = sdkEntryParams;

  try {
    const entryPointIdentifier = convertV1FetchParamsToEntryPoint(fetchParams);
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
  const [, fetchParams] = separateFetchParamsFromOtherOptions(options as SDKEntryAndFetchParams);
  return convertV1FetchParamsToEntryPoint(fetchParams);
};

export type { SDKEntryParams, SDKEntryAndFetchParams };
export {
  getRemoteEntryPointIdentifier,
  loadRemoteEntryContainer,
  resolveRemoteEntry,
  separateFetchParamsFromOtherOptions,
};

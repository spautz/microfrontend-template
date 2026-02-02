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
  /**
   * Location where the microfrontend has been deployed. Assets will be resolved relative to this.
   */
  baseUrl: string | URL;
  /**
   * If we cannot reach the microfrontend, details will be sent here.
   */
  onInitializationError: (error: Error, message: string) => void;
  /**
   * The microfrontend *should* never throw any error, but if it does then it will be sent here.
   */
  onUncaughtRuntimeError: (error: Error) => void;
  /**
   * Some build systems don't allow dependencies to do dynamic imports: if your app's build
   * raises an error like "Module not found: Can't resolve <dynamic>", then the `import()`
   * within the library isn't being treated properly.
   *
   * You can fix that by supplying your own locally-scoped and build-system-excluded
   * implementation. It will usually look like:
   *  `doDynamicImport: (url) => import(url),`
   * and it may have inline comments like `turbopackIgnore: true`
   */
  doDynamicImport?: ((url: string) => ReturnType<typeof loadRemoteEntryContainer>) | undefined;
  /**
   * Modules present in the host app which the microfrontend may make use of.
   */
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
    doDynamicImport,
    locale = null,
    sharedDependencies = {},
    ...otherOptions
  } = allOptions;

  const initializationParams = {
    baseUrl,
    onInitializationError,
    onUncaughtRuntimeError,
    doDynamicImport,
    sharedDependencies,
  };
  const fetchParams = { locale };

  return [initializationParams, fetchParams, otherOptions];
};

const resolveRemoteEntry = async (
  allOptions: InitializationAndFetchParams,
): Promise<ExportsFromRemoteEntryModule> => {
  const [initializationParams, fetchParams] = separateFetchParamsFromOtherOptions(allOptions);

  const { baseUrl, onInitializationError } = initializationParams;

  try {
    const entryPointIdentifier = convertV1FetchParamsToEntryPoint(fetchParams);
    await ensureHeaderStyles({ baseUrl, fetchParams }).catch((error) => {
      onInitializationError(convertCaughtValueToError(error), 'Could not preload header styles');
    });
    const entryPoint = `./${entryPointIdentifier}`;

    const container = await loadRemoteEntryContainer(initializationParams);
    const factory = await container.get(entryPoint);

    const module = await factory();
    return module as ExportsFromRemoteEntryModule;
  } catch (error: unknown) {
    onInitializationError(convertCaughtValueToError(error), 'Could not resolve remote entry');
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

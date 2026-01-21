import {
  type BeverageV1FetchParams,
  type BeverageV1Payload,
  convertBeverageV1FetchParamsToURLPath,
  isValidBeverageV1Payload,
  parseBeverageV1Payload,
} from '@spautz/myconfig-contracts';
import { isPromise } from '../utils.js';
import {
  type InternalCacheState_CachedPayloadSource,
  type InternalCacheState_CacheStateContainer,
  type InternalCacheState_CacheStateEntry,
  internalCacheState_addChangeListener,
  internalCacheState_addGlobalChangeListener,
  internalCacheState_getCacheEntry,
  internalCacheState_getCurrentPayload,
  internalCacheState_initializeCacheStateContainer,
  internalCacheState_removeChangeListener,
  internalCacheState_removeGlobalChangeListener,
  internalCacheState_setPayloadForSource,
  internalCacheState_setPayloadPromise,
} from './cacheState.ts';

///////////////////////////////////////////////////////////////////////////////
// State Container Setup

const DEBUG_LABEL = 'v1Beverage';

let v1BeverageCacheStateContainer: InternalCacheState_CacheStateContainer<
  BeverageV1FetchParams,
  BeverageV1Payload
>;

/**
 * Initializes the Beverage cache with a base URL. This is required before you do anything else.
 */
const internal_initializeV1BeverageCache = (baseUrl: string | URL): void => {
  if (v1BeverageCacheStateContainer && process.env.NODE_ENV !== 'production') {
    // We might have a duplicate: are the baseURLs equal?
    const currentBaseUrl = new URL(v1BeverageCacheStateContainer.baseUrl).toString();
    const newBaseUrl = new URL(baseUrl).toString();
    if (!newBaseUrl.endsWith('/')) {
      console.error(`BeverageCache initialization: baseUrl does not end with '/' (`);
    }
    if (currentBaseUrl === newBaseUrl) {
      console.error(
        `Duplicate BeverageCache initialization: you already had a cache for base URL "${newBaseUrl}"`,
      );
    }
  }

  v1BeverageCacheStateContainer = internalCacheState_initializeCacheStateContainer<
    BeverageV1FetchParams,
    BeverageV1Payload
  >(DEBUG_LABEL, {
    baseUrl,
    convertFetchParamsToUrl: (fetchParams) =>
      new URL(convertBeverageV1FetchParamsToURLPath(fetchParams), baseUrl),
    validatePayload: isValidBeverageV1Payload,
    parsePayload: parseBeverageV1Payload,
  });
};

/**
 * Returns the full internal cache state container. Do not use this unless you know what you're doing.
 */
const internal_getV1BeverageCacheStateContainer = (): InternalCacheState_CacheStateContainer<
  BeverageV1FetchParams,
  BeverageV1Payload
> => {
  if (!v1BeverageCacheStateContainer) {
    throw new Error('The Beverage cache must be initialized before it can be used.');
  }
  return v1BeverageCacheStateContainer;
};

/**
 * Most of the utilities below are thin wrappers around base cacheState functions:
 * this util curries / partials in the v1BeverageCacheStateContainer for them.
 */
const bindFunctionToCacheState = <ArgsType extends unknown[], ReturnType>(
  fn: (
    container: InternalCacheState_CacheStateContainer<BeverageV1FetchParams, BeverageV1Payload>,
    ...args: ArgsType
  ) => ReturnType,
): ((...args: ArgsType) => ReturnType) => {
  return (...args: ArgsType): ReturnType =>
    fn(internal_getV1BeverageCacheStateContainer(), ...args);
};

///////////////////////////////////////////////////////////////////////////////
// State Querying and Manipulation

const internal_getV1BeverageCacheEntry = bindFunctionToCacheState(
  internalCacheState_getCacheEntry<BeverageV1FetchParams, BeverageV1Payload>,
);

/**
 * Returns the highest-priority-source payload we have
 */
const internal_getV1BeveragePayload = bindFunctionToCacheState(
  internalCacheState_getCurrentPayload<BeverageV1FetchParams, BeverageV1Payload>,
);

const internal_setV1BeveragePayloadPromise = bindFunctionToCacheState(
  internalCacheState_setPayloadPromise<BeverageV1FetchParams, BeverageV1Payload>,
);

const internal_setV1BeveragePayloadForSource = bindFunctionToCacheState(
  internalCacheState_setPayloadForSource<BeverageV1FetchParams, BeverageV1Payload>,
);

/**
 * Populates the cache with the value provided, if it's valid.
 */
const internal_setV1BeveragePayload = (
  fetchParams: BeverageV1FetchParams,
  newValue: BeverageV1Payload | Promise<BeverageV1Payload>,
  source: InternalCacheState_CachedPayloadSource,
): InternalCacheState_CacheStateEntry<BeverageV1FetchParams, BeverageV1Payload> => {
  if (isPromise(newValue)) {
    return internal_setV1BeveragePayloadPromise(fetchParams, newValue, source);
  }
  return internal_setV1BeveragePayloadForSource(fetchParams, newValue, source);
};

const internal_addV1BeverageChangeListener = bindFunctionToCacheState(
  internalCacheState_addChangeListener<BeverageV1FetchParams, BeverageV1Payload>,
);
const internal_removeV1BeverageChangeListener = bindFunctionToCacheState(
  internalCacheState_removeChangeListener<BeverageV1FetchParams, BeverageV1Payload>,
);
const internal_addGlobalV1BeverageChangeListener = bindFunctionToCacheState(
  internalCacheState_addGlobalChangeListener<BeverageV1FetchParams, BeverageV1Payload>,
);
const internal_removeGlobalV1BeverageChangeListener = bindFunctionToCacheState(
  internalCacheState_removeGlobalChangeListener<BeverageV1FetchParams, BeverageV1Payload>,
);

export {
  internal_initializeV1BeverageCache,
  internal_getV1BeverageCacheStateContainer,
  internal_getV1BeverageCacheEntry,
  internal_getV1BeveragePayload,
  internal_setV1BeveragePayload,
  internal_addV1BeverageChangeListener,
  internal_removeV1BeverageChangeListener,
  internal_addGlobalV1BeverageChangeListener,
  internal_removeGlobalV1BeverageChangeListener,
};

/*
 * This file defines general, abstract utils and for tracking cache state.
 * Each config-specific store should rely on this to set up its own local cache.
 *
 * Terminology:
 *    "config payload": a single json config (i.e., one file), uniquely identified by its URL
 *    "config category": the type (and schema) of a config payload, like "v1Beverage"
 *    "cache state entry": the metadata and internal status of one config payload
 *    "cache state container": the set of cache entries for all available URLs in a given category,
 *      along with metadata for mapping params to config files and cache entries
 *
 * These should generally not be called except through a category-specific store
 * (like v1BeverageCacheState) -- the functions are all prefixed with "internalCacheState_"
 * to discourage casual use.
 */

// Each config payload (identified by its URL) will be in one of these states.
// This represents *presence*: other values below track freshness and updates.
// Ordered from lowest to highest priority:
const CACHED_PAYLOAD_SOURCE__NONE = 0;
/**
 * Supplied by a local copy of the values package. Considered stale.
 * (not yet implemented)
 */
const CACHED_PAYLOAD_SOURCE__BACKUP = 1;
/**
 * Supplied by the host app, but may be overridden. Useful for server cases.
 */
const CACHED_PAYLOAD_SOURCE__SEED = 2;
/**
 * Fetched from a remote source. Generally up-to-date.
 */
const CACHED_PAYLOAD_SOURCE__REMOTE = 3;
/**
 * Specified by the host app, and may not be overridden. Useful for testing.
 */
const CACHED_PAYLOAD_SOURCE__OVERRIDE = 4;

/**
 * We'll use this to pre-initialize arrays for tracking value/status/etc for each source
 */
const numPayloadSources = CACHED_PAYLOAD_SOURCE__OVERRIDE + 1;

type InternalCacheState_CachedPayloadSource =
  | typeof CACHED_PAYLOAD_SOURCE__NONE
  | typeof CACHED_PAYLOAD_SOURCE__BACKUP
  | typeof CACHED_PAYLOAD_SOURCE__SEED
  | typeof CACHED_PAYLOAD_SOURCE__REMOTE
  | typeof CACHED_PAYLOAD_SOURCE__OVERRIDE;

// These only apply for CACHED_PAYLOAD_SOURCE__REMOTE
const CACHED_PAYLOAD_FRESHNESS__NONE = 0;
const CACHED_PAYLOAD_FRESHNESS__STALE = 1;
const CACHED_PAYLOAD_FRESHNESS__FRESH = 2;

type InternalCacheState_CachedPayloadFreshness =
  | typeof CACHED_PAYLOAD_FRESHNESS__NONE
  | typeof CACHED_PAYLOAD_FRESHNESS__STALE
  | typeof CACHED_PAYLOAD_FRESHNESS__FRESH;

type InternalCacheState_PayloadMeta = {
  // Presence
  hasPayload: boolean;
  hasError: boolean;
  // Freshness
  isLoading: boolean;
  isFresh: boolean;
  lastUpdated: number;
  // Source
  isBackupValue: boolean;
  isSeedValue: boolean;
  isRemoteValue: boolean;
  isOverrideValue: boolean;
};

/**
 * Tracks status and freshness of a single payload, potentially spanning multiple sources
 */
type InternalCacheState_CacheStateEntry<FetchParamsType, PayloadType> = {
  promises: Array<Promise<PayloadType> | undefined>;
  payloads: Array<PayloadType | undefined>;
  updateTimes: Array<ReturnType<typeof Date.now> | 0>;
  meta: InternalCacheState_PayloadMeta;
  // @TODO: Track errors: result, retryCount, timing
  // @TODO: Events and external observers: subscribe, unsubscribe
  fetchParams: FetchParamsType;
  remoteUrl: URL;
  bestSource: InternalCacheState_CachedPayloadSource;
  onChange: Array<(newValue: PayloadType, oldValue: PayloadType | undefined) => void>;
};

/**
 * A collection of status & freshness information for all config files.
 */
interface InternalCacheState_CacheStateContainer<FetchParamsType, PayloadType> {
  _state: Record<string, InternalCacheState_CacheStateEntry<FetchParamsType, PayloadType>>;
  debugLabel: string;
  baseUrl: URL | string;
  convertFetchParamsToUrl: (fetchParams: FetchParamsType, baseUrl: string | URL) => URL;
  validatePayload: ((rawData: unknown) => boolean) | undefined;
  parsePayload: ((rawData: unknown) => PayloadType) | undefined;
  onGlobalChange: Array<
    (
      cacheEntry: InternalCacheState_CacheStateEntry<FetchParamsType, PayloadType>,
      newValue: PayloadType,
      oldValue: PayloadType | undefined,
    ) => void
  >;
}

const internalCacheState_initializeCacheStateContainer = <FetchParamsType, PayloadType>(
  debugLabel: string,
  {
    baseUrl,
    convertFetchParamsToUrl,
    validatePayload,
    parsePayload,
  }: {
    baseUrl: InternalCacheState_CacheStateContainer<FetchParamsType, PayloadType>['baseUrl'];
    convertFetchParamsToUrl: InternalCacheState_CacheStateContainer<
      FetchParamsType,
      PayloadType
    >['convertFetchParamsToUrl'];
    validatePayload?: InternalCacheState_CacheStateContainer<
      FetchParamsType,
      PayloadType
    >['validatePayload'];
    parsePayload?: InternalCacheState_CacheStateContainer<
      FetchParamsType,
      PayloadType
    >['parsePayload'];
  },
): InternalCacheState_CacheStateContainer<FetchParamsType, PayloadType> => {
  return {
    _state: Object.create(null),
    onGlobalChange: [],
    debugLabel,
    baseUrl,
    convertFetchParamsToUrl,
    validatePayload,
    parsePayload,
  };
};

const internalCacheState_getURLForParams = <FetchParamsType, PayloadType>(
  internalCacheState_cacheStateContainer: InternalCacheState_CacheStateContainer<
    FetchParamsType,
    PayloadType
  >,
  fetchParams: FetchParamsType,
): URL => {
  return internalCacheState_cacheStateContainer.convertFetchParamsToUrl(
    fetchParams,
    internalCacheState_cacheStateContainer.baseUrl,
  );
};

const internalCacheState_initializeCacheEntryForParams = <FetchParamsType, PayloadType>(
  _cacheStateContainer: InternalCacheState_CacheStateContainer<FetchParamsType, PayloadType>,
  fetchParams: FetchParamsType,
  remoteUrl: URL,
): InternalCacheState_CacheStateEntry<FetchParamsType, PayloadType> => ({
  promises: Array(numPayloadSources),
  payloads: Array(numPayloadSources),
  updateTimes: Array(numPayloadSources).fill(0),
  meta: {
    hasPayload: false,
    hasError: false,
    isLoading: false,
    isFresh: false,
    lastUpdated: 0,
    isBackupValue: false,
    isSeedValue: false,
    isRemoteValue: false,
    isOverrideValue: false,
  },
  // @TODO: Track errors: result, retryCount, timing
  fetchParams,
  remoteUrl,
  bestSource: CACHED_PAYLOAD_SOURCE__NONE,
  onChange: [],
});

const internalCacheState_getCacheEntry = <FetchParamsType, PayloadType>(
  internalCacheState_cacheStateContainer: InternalCacheState_CacheStateContainer<
    FetchParamsType,
    PayloadType
  >,
  fetchParams: FetchParamsType,
): InternalCacheState_CacheStateEntry<FetchParamsType, PayloadType> => {
  const remoteUrl = internalCacheState_getURLForParams(
    internalCacheState_cacheStateContainer,
    fetchParams,
  );
  const cacheKey = remoteUrl.toString();

  if (!internalCacheState_cacheStateContainer._state[cacheKey]) {
    internalCacheState_cacheStateContainer._state[cacheKey] =
      internalCacheState_initializeCacheEntryForParams(
        internalCacheState_cacheStateContainer,
        fetchParams,
        remoteUrl,
      );
  }
  return internalCacheState_cacheStateContainer._state[cacheKey];
};

/**
 * Synchronously returns the raw payload value currently in the cache state
 */
const internalCacheState_getCurrentPayload = <FetchParamsType, PayloadType>(
  internalCacheState_cacheStateContainer: InternalCacheState_CacheStateContainer<
    FetchParamsType,
    PayloadType
  >,
  fetchParams: FetchParamsType,
): PayloadType | undefined => {
  const cacheEntry = internalCacheState_getCacheEntry(
    internalCacheState_cacheStateContainer,
    fetchParams,
  );
  return cacheEntry.payloads[cacheEntry.bestSource];
};

/**
 * Synchronously returns metadata about the payload currently in state: presence and freshness
 */
const internalCacheState_getPayloadMeta = <FetchParamsType, PayloadType>(
  internalCacheState_cacheStateContainer: InternalCacheState_CacheStateContainer<
    FetchParamsType,
    PayloadType
  >,
  fetchParams: FetchParamsType,
): InternalCacheState_PayloadMeta => {
  const cacheEntry = internalCacheState_getCacheEntry(
    internalCacheState_cacheStateContainer,
    fetchParams,
  );
  return cacheEntry.meta;
};

const internalCacheState_setPayloadForSource = <FetchParamsType, PayloadType>(
  internalCacheState_cacheStateContainer: InternalCacheState_CacheStateContainer<
    FetchParamsType,
    PayloadType
  >,
  fetchParams: FetchParamsType,
  newValue: PayloadType,
  source: InternalCacheState_CachedPayloadSource,
): InternalCacheState_CacheStateEntry<FetchParamsType, PayloadType> => {
  const cacheEntry = internalCacheState_getCacheEntry(
    internalCacheState_cacheStateContainer,
    fetchParams,
  );
  const { debugLabel, validatePayload, parsePayload, onGlobalChange } =
    internalCacheState_cacheStateContainer;
  const { bestSource, onChange } = cacheEntry;

  // @TODO: Try/catch for specific cases, callback instead of inline error
  if (validatePayload) {
    const isValid = validatePayload(newValue);
    if (!isValid) {
      // @TODO: log/traceback to help debugging
      console.warn(`Invalid config payload for ${debugLabel}`, newValue);
      return cacheEntry;
    }
  }

  // @TODO: Try/catch & callback
  const parsedValue = parsePayload ? parsePayload(newValue) : newValue;

  const oldValue = cacheEntry.payloads[cacheEntry.bestSource];
  const updateTime = Date.now();
  const nextBestSource = source > bestSource ? source : bestSource;

  // Clear old promise, set new value
  const nextPromises = [...cacheEntry.promises];
  nextPromises[source] = undefined;
  const nextPayloads = [...cacheEntry.payloads];
  nextPayloads[source] = parsedValue;
  const nextUpdateTimes = [...cacheEntry.updateTimes];
  nextUpdateTimes[source] = updateTime;

  const nextEntry = {
    ...cacheEntry,
    promises: nextPromises,
    payloads: nextPayloads,
    updateTimes: nextUpdateTimes,
    bestSource: nextBestSource,
    meta: {
      // @TODO: Optimizations, cleanup, and make this all honest/calculated
      hasPayload: true,
      hasError: false,
      isLoading: false,
      isFresh: true,
      lastUpdated: updateTime,
      isBackupValue: source === CACHED_PAYLOAD_SOURCE__BACKUP,
      isSeedValue: source === CACHED_PAYLOAD_SOURCE__SEED,
      isRemoteValue: source === CACHED_PAYLOAD_SOURCE__REMOTE,
      isOverrideValue: source === CACHED_PAYLOAD_SOURCE__OVERRIDE,
    },
  };

  const cacheKey = cacheEntry.remoteUrl.toString();
  internalCacheState_cacheStateContainer._state[cacheKey] = nextEntry;

  // @TODO: equality check to avoid firing unnecessary change events
  if (source >= bestSource) {
    console.log('FIRE change event');
    if (onChange.length) {
      for (const callback of onChange) {
        callback(parsedValue, oldValue);
      }
    }
    if (onGlobalChange.length) {
      for (const globalCallback of onGlobalChange) {
        globalCallback(nextEntry, parsedValue, oldValue);
      }
    }
  } else console.log('NOT firing change event');

  return nextEntry;
};

const internalCacheState_setPayloadPromise = <FetchParamsType, PayloadType>(
  internalCacheState_cacheStateContainer: InternalCacheState_CacheStateContainer<
    FetchParamsType,
    PayloadType
  >,
  fetchParams: FetchParamsType,
  newPromise: Promise<PayloadType>,
  source: InternalCacheState_CachedPayloadSource,
): InternalCacheState_CacheStateEntry<FetchParamsType, PayloadType> => {
  const cacheEntry = internalCacheState_getCacheEntry(
    internalCacheState_cacheStateContainer,
    fetchParams,
  );

  // Track promise and queue up a value-assignment once it finishes
  const nextPromises = [...cacheEntry.promises];
  nextPromises[source] = newPromise;

  const nextEntry = {
    ...cacheEntry,
    promises: nextPromises,
  };

  const cacheKey = cacheEntry.remoteUrl.toString();
  internalCacheState_cacheStateContainer._state[cacheKey] = nextEntry;

  newPromise.then((newPayload) => {
    const latestEntry = internalCacheState_getCacheEntry(
      internalCacheState_cacheStateContainer,
      fetchParams,
    );
    if (newPromise === latestEntry.promises[source]) {
      internalCacheState_setPayloadForSource(
        internalCacheState_cacheStateContainer,
        fetchParams,
        newPayload,
        source,
      );
    }
    // Else: this promise was replaced while we were waiting, so don't do anything
  });

  return nextEntry;
};

const internalCacheState_addChangeListener = <FetchParamsType, PayloadType>(
  internalCacheState_cacheStateContainer: InternalCacheState_CacheStateContainer<
    FetchParamsType,
    PayloadType
  >,
  fetchParams: FetchParamsType,
  callbackFn: (newValue: PayloadType, oldValue: PayloadType | undefined) => void,
): (() => void) => {
  const cacheEntry = internalCacheState_getCacheEntry(
    internalCacheState_cacheStateContainer,
    fetchParams,
  );
  if (!cacheEntry.onChange.includes(callbackFn)) {
    const nextEntry = {
      ...cacheEntry,
      onChange: [...cacheEntry.onChange, callbackFn],
    };

    const cacheKey = cacheEntry.remoteUrl.toString();
    internalCacheState_cacheStateContainer._state[cacheKey] = nextEntry;
  }

  const unsubscribe = () =>
    internalCacheState_removeChangeListener(
      internalCacheState_cacheStateContainer,
      fetchParams,
      callbackFn,
    );
  return unsubscribe;
};

const internalCacheState_removeChangeListener = <FetchParamsType, PayloadType>(
  internalCacheState_cacheStateContainer: InternalCacheState_CacheStateContainer<
    FetchParamsType,
    PayloadType
  >,
  fetchParams: FetchParamsType,
  callbackFn: (newValue: PayloadType, oldValue: PayloadType | undefined) => void,
): InternalCacheState_CacheStateEntry<FetchParamsType, PayloadType> => {
  const cacheEntry = internalCacheState_getCacheEntry(
    internalCacheState_cacheStateContainer,
    fetchParams,
  );

  const nextEntry = {
    ...cacheEntry,
    onChange: cacheEntry.onChange.filter((existingCallback) => existingCallback !== callbackFn),
  };

  const cacheKey = cacheEntry.remoteUrl.toString();
  internalCacheState_cacheStateContainer._state[cacheKey] = nextEntry;
  return nextEntry;
};

const internalCacheState_addGlobalChangeListener = <FetchParamsType, PayloadType>(
  internalCacheState_cacheStateContainer: InternalCacheState_CacheStateContainer<
    FetchParamsType,
    PayloadType
  >,
  callbackFn: (
    cacheEntry: InternalCacheState_CacheStateEntry<FetchParamsType, PayloadType>,
    newValue: PayloadType,
    oldValue: PayloadType | undefined,
  ) => void,
): (() => void) => {
  const { onGlobalChange } = internalCacheState_cacheStateContainer;
  if (!onGlobalChange.includes(callbackFn)) {
    internalCacheState_cacheStateContainer.onGlobalChange = [...onGlobalChange, callbackFn];
  }

  const unsubscribe = () =>
    internalCacheState_removeGlobalChangeListener(
      internalCacheState_cacheStateContainer,
      callbackFn,
    );
  return unsubscribe;
};

const internalCacheState_removeGlobalChangeListener = <FetchParamsType, PayloadType>(
  internalCacheState_cacheStateContainer: InternalCacheState_CacheStateContainer<
    FetchParamsType,
    PayloadType
  >,
  callbackFn: (
    cacheEntry: InternalCacheState_CacheStateEntry<FetchParamsType, PayloadType>,
    newValue: PayloadType,
    oldValue: PayloadType | undefined,
  ) => void,
): InternalCacheState_CacheStateContainer<FetchParamsType, PayloadType> => {
  const { onGlobalChange } = internalCacheState_cacheStateContainer;

  internalCacheState_cacheStateContainer.onGlobalChange = onGlobalChange.filter(
    (existingCallback) => existingCallback !== callbackFn,
  );

  return internalCacheState_cacheStateContainer;
};

export type {
  InternalCacheState_CachedPayloadSource,
  InternalCacheState_CachedPayloadFreshness,
  InternalCacheState_CacheStateEntry,
  InternalCacheState_CacheStateContainer,
  InternalCacheState_PayloadMeta,
};
export {
  CACHED_PAYLOAD_SOURCE__NONE,
  CACHED_PAYLOAD_SOURCE__BACKUP,
  CACHED_PAYLOAD_SOURCE__SEED,
  CACHED_PAYLOAD_SOURCE__REMOTE,
  CACHED_PAYLOAD_SOURCE__OVERRIDE,
  CACHED_PAYLOAD_FRESHNESS__NONE,
  CACHED_PAYLOAD_FRESHNESS__STALE,
  CACHED_PAYLOAD_FRESHNESS__FRESH,
  internalCacheState_initializeCacheStateContainer,
  internalCacheState_getCacheEntry,
  internalCacheState_getCurrentPayload,
  internalCacheState_getPayloadMeta,
  internalCacheState_setPayloadForSource,
  internalCacheState_setPayloadPromise,
  internalCacheState_addChangeListener,
  internalCacheState_removeChangeListener,
  internalCacheState_addGlobalChangeListener,
  internalCacheState_removeGlobalChangeListener,
};

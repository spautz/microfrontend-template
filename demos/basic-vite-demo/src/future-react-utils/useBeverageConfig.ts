import {
  type BeverageFetchParams,
  type BeveragePayload,
  type InternalCacheState_CacheStateContainer,
  type InternalCacheState_CacheStateEntry,
  initializeBeverageCache,
  internal_getV1BeverageCacheStateContainer,
  internalCacheState_addChangeListener,
  internalCacheState_getCacheEntry,
  internalCacheState_getCurrentPayload,
} from '@spautz/myconfig-sdk';
import { useEffect, useState } from 'react';

// @TODO: Move this into the SDK
type PayloadState = {
  // Presence
  hasPayload: boolean;
  hasError: boolean;
  isLoading: boolean;
  // Freshness & related status
  isBackupValue: boolean;
  isSeedValue: boolean;
  isRemoteValue: boolean;
  isOverrideValue: boolean;
};

const internal_useRemoteConfig = <FetchParamsType, PayloadType>(
  internalCacheStateContainer: InternalCacheState_CacheStateContainer<FetchParamsType, PayloadType>,
  fetchParams: FetchParamsType,
): [
  PayloadState,
  PayloadType | undefined,
  InternalCacheState_CacheStateEntry<FetchParamsType, PayloadType>,
] => {
  const [payload, setPayload] = useState(
    internalCacheState_getCurrentPayload(internalCacheStateContainer, fetchParams),
  );

  useEffect(() => {
    const unsubscribe = internalCacheState_addChangeListener(
      internalCacheStateContainer,
      fetchParams,
      () => {
        console.log(
          'Payload changed!',
          internalCacheState_getCacheEntry(internalCacheStateContainer, fetchParams),
        );
        setPayload(internalCacheState_getCurrentPayload(internalCacheStateContainer, fetchParams));
      },
    );
    return unsubscribe;
  }, [internalCacheStateContainer, fetchParams]);

  return [
    {
      // @TODO: Implement this properly -- just dummy data for now
      hasPayload: !!payload,
      hasError: false,
      isLoading: false,
      isBackupValue: false,
      isSeedValue: true,
      isRemoteValue: false,
      isOverrideValue: false,
    },
    payload,
    internalCacheState_getCacheEntry(internalCacheStateContainer, fetchParams),
  ];
};

let isInitialized = false;

const useBeverageConfig = (
  baseUrl: string | URL,
): [
  PayloadState,
  BeveragePayload | undefined,
  InternalCacheState_CacheStateEntry<BeverageFetchParams, BeveragePayload>,
] => {
  if (!isInitialized) {
    // @TODO: Properly respond to baseUrl changes
    initializeBeverageCache(baseUrl);
    isInitialized = true;
  }
  return internal_useRemoteConfig(internal_getV1BeverageCacheStateContainer(), undefined);
};

export { internal_useRemoteConfig, useBeverageConfig };

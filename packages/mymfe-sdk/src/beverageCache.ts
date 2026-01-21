/*
 * This file is the point where "V1 beverages" become just "beverages".
 * The outside consumer doesn't know or care whether we're using V1 or something else:
 * from here on the exposed typings are what matters.
 *
 * We only support Beverages V1 right now, so no need to do anything special when initializing or interacting
 * with it. If we were to add a Beverages V2, we could split/combine versions for both of them here.
 */

import type { BeverageV1FetchParams, BeverageV1Payload } from '@spautz/myconfig-contracts';
import { internal_getV1BeverageCacheStateContainer } from './caches/v1BeverageCacheState.ts';

export {
  internal_addGlobalV1BeverageChangeListener as addGlobalBeverageChangeListener,
  internal_addV1BeverageChangeListener as addBeverageChangeListener,
  internal_getV1BeveragePayload as getCurrentBeveragePayload,
  internal_initializeV1BeverageCache as initializeBeverageCache,
  internal_removeGlobalV1BeverageChangeListener as removeGlobalBeverageChangeListener,
  internal_removeV1BeverageChangeListener as removeBeverageChangeListener,
} from './caches/v1BeverageCacheState.js';

import { internalCacheState_fetchRemotePayload } from './fetch/fetchRemotePayload.ts';

const fetchBeverage = (fetchParams?: BeverageV1FetchParams) => {
  return internalCacheState_fetchRemotePayload(
    internal_getV1BeverageCacheStateContainer(),
    fetchParams,
  );
};

// @TODO:
// internal_getV1BeverageCacheEntry,
// internal_setV1BeveragePayload,

export type { BeverageV1FetchParams as BeverageFetchParams, BeverageV1Payload as BeveragePayload };
export { fetchBeverage };

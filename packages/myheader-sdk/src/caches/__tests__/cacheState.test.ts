import { describe, expect, it } from 'vitest';

import {
  internalCacheState_getCacheEntry,
  internalCacheState_initializeCacheStateContainer,
} from '../cacheState.ts';

describe('Cache State Container', () => {
  describe('initializeCacheStateContainer', () => {
    it('should initialize a blank state container', () => {
      const alwaysReturnExampleUrl = () => new URL('https://example.com/unit-test-example.json');
      const cacheStateContainer = internalCacheState_initializeCacheStateContainer('unit tests', {
        baseUrl: 'https://example.com',
        convertFetchParamsToUrl: alwaysReturnExampleUrl,
      });

      expect(cacheStateContainer).toEqual({
        _state: {},
        debugLabel: 'unit tests',
        baseUrl: 'https://example.com',
        convertFetchParamsToUrl: alwaysReturnExampleUrl,
        onGlobalChange: [],
      });
    });
  });

  describe('internalCacheState_getCacheEntry', () => {
    it('should return a blank cache entry on first call', () => {
      const alwaysReturnExampleUrl = () => new URL('https://example.com/unit-test-example.json');
      const cacheStateContainer = internalCacheState_initializeCacheStateContainer('unit tests', {
        baseUrl: 'https://example.com',
        convertFetchParamsToUrl: alwaysReturnExampleUrl,
      });
      const cacheEntry = internalCacheState_getCacheEntry(cacheStateContainer, 'example param');

      expect(cacheEntry).toMatchObject({
        promises: Array(5),
        payloads: Array(5),
        updateTimes: Array(5).fill(0),
        fetchParams: 'example param',
        remoteUrl: new URL('https://example.com/unit-test-example.json'),
        bestSource: 0,
        onChange: [],
      });
    });
  });
});

import {
  CACHED_PAYLOAD_SOURCE__REMOTE,
  type InternalCacheState_CacheStateContainer,
  type InternalCacheState_CacheStateEntry,
  internalCacheState_getCacheEntry,
  internalCacheState_setPayloadPromise,
} from '../caches/cacheState.ts';

// @TODO: Move this to common utils, add support for more types
const RESPONSE_PARSERS = new Map<
  Array<string | undefined>,
  (response: Response) => Promise<unknown>
>([
  [[undefined, 'json'], (response) => response.json()],
  [['html', 'log', 'md', 'txt'], (response) => response.text()],
]);

const internalCacheState_fetchRemotePayload = async <FetchParamsType, PayloadType>(
  internalCacheState_cacheStateContainer: InternalCacheState_CacheStateContainer<
    FetchParamsType,
    PayloadType
  >,
  fetchParams: FetchParamsType,
): Promise<InternalCacheState_CacheStateEntry<FetchParamsType, PayloadType>> => {
  const cacheEntry = internalCacheState_getCacheEntry(
    internalCacheState_cacheStateContainer,
    fetchParams,
  );
  const { remoteUrl } = cacheEntry;

  console.log('fetchRemotePayload: ', remoteUrl, cacheEntry);

  // What are we actually fetching?
  const fileExtension = remoteUrl.pathname.split('.').pop();
  console.log('fileExtension: ', fileExtension);

  let responseParserFn: ((response: Response) => Promise<PayloadType>) | undefined;
  // Loop through RESPONSE_PARSERS to find a match for our file extension
  for (const [extensions, parserFn] of RESPONSE_PARSERS) {
    if (extensions.includes(fileExtension)) {
      responseParserFn = parserFn as () => Promise<PayloadType>;
      break;
    }
  }

  if (!responseParserFn) {
    throw new Error(`No response parser found for file extension: ${fileExtension}`);
  }

  return internalCacheState_setPayloadPromise(
    internalCacheState_cacheStateContainer,
    fetchParams,
    fetch(remoteUrl).then(responseParserFn),
    CACHED_PAYLOAD_SOURCE__REMOTE,
  );
};

export { internalCacheState_fetchRemotePayload };

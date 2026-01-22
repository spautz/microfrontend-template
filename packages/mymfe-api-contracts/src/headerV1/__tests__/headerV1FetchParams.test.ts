import { describe, expect, test } from 'vitest';
import {
  ALL_HISTORICAL__HeaderV1FetchParamExamples,
  type ALL_HISTORICAL__HeaderV1FetchParamTypes,
} from '../HISTORICAL_HEADER_V1_TYPES.js';
import {
  type HeaderV1FetchParams,
  headerV1FetchParamExamples,
  headerV1FetchParamSchema,
} from '../headerV1FetchParams.js';
import type { DeepReadonly } from './testUtils.ts';

// The current examples must match the current typings
headerV1FetchParamExamples satisfies Array<HeaderV1FetchParams>;

// Historical examples must still be valid
ALL_HISTORICAL__HeaderV1FetchParamExamples satisfies DeepReadonly<Array<HeaderV1FetchParams>>;

// The current type must be assignable to all historical types
null as unknown as HeaderV1FetchParams satisfies ALL_HISTORICAL__HeaderV1FetchParamTypes;

// Current examples must still be valid against old contracts
headerV1FetchParamExamples satisfies Array<ALL_HISTORICAL__HeaderV1FetchParamTypes>;

// Finally, validate all examples against the schema
describe('HeaderV1 FetchParams', () => {
  test.each(
    headerV1FetchParamExamples,
  )('Examples all pass current schema (#%#)', (exampleFetchParams) => {
    const result = headerV1FetchParamSchema.safeParse(exampleFetchParams);
    expect(result.error).toBeFalsy();
  });

  test.each(
    ALL_HISTORICAL__HeaderV1FetchParamExamples,
  )('Historical examples all pass current schema (%#: $milestoneName)', (exampleFetchParams) => {
    const result = headerV1FetchParamSchema.safeParse(exampleFetchParams);
    expect(result.error).toBeFalsy();
  });
});

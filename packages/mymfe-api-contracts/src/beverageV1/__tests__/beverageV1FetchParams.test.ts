import { describe, expect, test } from 'vitest';

import {
  type BeverageV1FetchParams,
  beverageV1FetchParamExamples,
  beverageV1FetchParamSchema,
} from '../beverageV1FetchParams.js';
import {
  ALL_HISTORICAL__BeverageV1FetchParamExamples,
  type ALL_HISTORICAL__BeverageV1FetchParamTypes,
} from '../HISTORICAL_BEVERAGE_V1_TYPES.js';
import { expectAssignable } from './testUtils.js';

// The current examples must match the current typings
expectAssignable<BeverageV1FetchParams>(beverageV1FetchParamExamples[0]);
expectAssignable<Array<BeverageV1FetchParams>>(beverageV1FetchParamExamples);

// Historical examples must still be valid
expectAssignable<BeverageV1FetchParams>(ALL_HISTORICAL__BeverageV1FetchParamExamples[0]);
expectAssignable<Array<BeverageV1FetchParams>>(ALL_HISTORICAL__BeverageV1FetchParamExamples);

// The current type must be assignable to all historical types
expectAssignable<ALL_HISTORICAL__BeverageV1FetchParamTypes>(
  null as unknown as BeverageV1FetchParams,
);

// Current examples must still be valid against old contracts
expectAssignable<ALL_HISTORICAL__BeverageV1FetchParamTypes>(beverageV1FetchParamExamples[0]);
expectAssignable<ReadonlyArray<ALL_HISTORICAL__BeverageV1FetchParamTypes>>(
  beverageV1FetchParamExamples,
);

// Finally, validate all examples against the schema
describe('BeverageV1 FetchParams', () => {
  test.each(
    beverageV1FetchParamExamples,
  )('Examples all pass current schema (#%#)', (exampleFetchParams) => {
    const result = beverageV1FetchParamSchema.safeParse(exampleFetchParams);
    expect(result.error).toBeFalsy();
  });

  test.each(
    ALL_HISTORICAL__BeverageV1FetchParamExamples,
  )('Historical examples all pass current schema (%#: $milestoneName)', (exampleFetchParams) => {
    const result = beverageV1FetchParamSchema.safeParse(exampleFetchParams);
    expect(result.error).toBeFalsy();
  });
});

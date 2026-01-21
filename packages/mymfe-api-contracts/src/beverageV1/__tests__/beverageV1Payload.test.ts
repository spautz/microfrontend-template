import { describe, expect, test } from 'vitest';

import {
  type BeverageV1Payload,
  beverageV1PayloadExamples,
  beverageV1PayloadSchema,
} from '../beverageV1Payload.js';
import {
  ALL_HISTORICAL__BeverageV1PayloadExamples,
  type ALL_HISTORICAL__BeverageV1PayloadTypes,
} from '../HISTORICAL_BEVERAGE_V1_TYPES.js';
import { expectAssignable } from './testUtils.js';

// The current examples must match the current typings
expectAssignable<BeverageV1Payload>(beverageV1PayloadExamples[0]);
expectAssignable<Array<BeverageV1Payload>>(beverageV1PayloadExamples);

// Historical examples must still be valid
expectAssignable<BeverageV1Payload>(ALL_HISTORICAL__BeverageV1PayloadExamples[0]);
expectAssignable<Array<BeverageV1Payload>>(ALL_HISTORICAL__BeverageV1PayloadExamples);

// The current type must be assignable to all historical types
expectAssignable<ALL_HISTORICAL__BeverageV1PayloadTypes>(null as unknown as BeverageV1Payload);

// Current examples must still be valid against old contracts
expectAssignable<ALL_HISTORICAL__BeverageV1PayloadTypes>(beverageV1PayloadExamples[0]);
expectAssignable<ReadonlyArray<ALL_HISTORICAL__BeverageV1PayloadTypes>>(beverageV1PayloadExamples);

// Finally, validate all examples against the schema
describe('BeverageV1 Payloads', () => {
  test.each(
    beverageV1PayloadExamples,
  )('Examples all pass current schema (#%#)', (examplePayload) => {
    const result = beverageV1PayloadSchema.safeParse(examplePayload);
    expect(result.error).toBeFalsy();
  });

  test.each(
    ALL_HISTORICAL__BeverageV1PayloadExamples,
  )('Historical examples all pass current schema (%#: $milestoneName)', (examplePayload) => {
    const result = beverageV1PayloadSchema.safeParse(examplePayload);
    expect(result.error).toBeFalsy();
  });
});

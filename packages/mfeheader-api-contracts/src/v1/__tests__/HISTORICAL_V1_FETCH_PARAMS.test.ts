import { describe, expect, test } from 'vitest';

import {
  type ALL_HISTORICAL__V1FetchParamsTypes,
  ALL_HISTORICAL__v1FetchParamsExamples,
  ALL_HISTORICAL__v1FetchParamsMilestones,
} from '../HISTORICAL_V1_FETCH_PARAMS.ts';
import {
  type V1FetchParams,
  v1FetchParamsExamples,
  v1FetchParamsSchema,
} from '../v1FetchParams.ts';

// Validate all historical examples against the historical typings.
// In general the examples should be `as const satisfies ...`, which would make these checks
// redundant. They're repeated here as an extra safety net.
ALL_HISTORICAL__v1FetchParamsExamples satisfies Readonly<Array<ALL_HISTORICAL__V1FetchParamsTypes>>;

// Historical examples must still be valid for the current types,
ALL_HISTORICAL__v1FetchParamsExamples satisfies Readonly<Array<V1FetchParams>>;

// The current types and the current examples must satisfy the historical contracts
null as unknown as V1FetchParams satisfies ALL_HISTORICAL__V1FetchParamsTypes;
v1FetchParamsExamples satisfies ReadonlyArray<ALL_HISTORICAL__V1FetchParamsTypes>;

describe('HISTORICAL_V1_FETCH_PARAMS', () => {
  // Ensure that the historical examples include all milestones
  // (If you missed one, it needs to be added to the bottom of `HISTORICAL_V1_FETCH_PARAMS.ts`)
  test('ALL_HISTORICAL__v1FetchParamsExamples includes all milestones', () => {
    const allExamplesFromAllMilestones = ALL_HISTORICAL__v1FetchParamsMilestones.flatMap(
      (milestone) => milestone.examples,
    );
    expect(allExamplesFromAllMilestones.length).toEqual(
      ALL_HISTORICAL__v1FetchParamsExamples.length,
    );
  });

  test.each(
    ALL_HISTORICAL__v1FetchParamsExamples,
  )('Historical examples all pass current schema (%#: $milestoneName)', (exampleFetchParams) => {
    const result = v1FetchParamsSchema.safeParse(exampleFetchParams);
    expect(result.error).toBeFalsy();
  });
});

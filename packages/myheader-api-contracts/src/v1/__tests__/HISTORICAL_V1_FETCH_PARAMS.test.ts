import { describe, expect, test } from 'vitest';

import {
  type ALL_HISTORICAL__V1FetchParamTypes,
  ALL_HISTORICAL__v1FetchParamExamples,
  ALL_HISTORICAL__v1FetchParamMilestones,
} from '../HISTORICAL_V1_FETCH_PARAMS.ts';
import { type V1FetchParams, v1FetchParamExamples, v1FetchParamSchema } from '../v1FetchParams.ts';
import type { DeepReadonly } from './testUtils.ts';

// Historical examples must match the historical typings
ALL_HISTORICAL__v1FetchParamExamples satisfies DeepReadonly<
  Array<ALL_HISTORICAL__V1FetchParamTypes>
>;

// Historical examples must still be valid
ALL_HISTORICAL__v1FetchParamExamples satisfies DeepReadonly<Array<V1FetchParams>>;

// The current type must satisfy all historical types
null as unknown as V1FetchParams satisfies ALL_HISTORICAL__V1FetchParamTypes;

// Current examples must still be valid against old contracts
v1FetchParamExamples satisfies Array<ALL_HISTORICAL__V1FetchParamTypes>;

// Ensure that those historical examples include all milestones
// (If you missed one, it needs to be added to the bottom of `HISTORICAL_V1_RENDER_TYPES.ts`)

describe('HISTORICAL_V1_FETCH_PARAMS', () => {
  // This is where we ensure that any newly-added milestones are also added to the overall set
  test('ALL_HISTORICAL__v1FetchParamExamples includes all milestones', () => {
    const allExamplesFromAllMilestones = ALL_HISTORICAL__v1FetchParamMilestones.flatMap(
      (milestone) => milestone.examples,
    );
    expect(allExamplesFromAllMilestones.length).toEqual(
      ALL_HISTORICAL__v1FetchParamExamples.length,
    );
  });

  test.each(
    ALL_HISTORICAL__v1FetchParamExamples,
  )('Historical examples all pass current schema (%#: $milestoneName)', (exampleFetchParams) => {
    const result = v1FetchParamSchema.safeParse(exampleFetchParams);
    expect(result.error).toBeFalsy();
  });
});

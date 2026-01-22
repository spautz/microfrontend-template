import { describe, expect, test } from 'vitest';

import {
  ALL_HISTORICAL__HeaderV1FetchParamExamples,
  ALL_HISTORICAL__HeaderV1FetchParamMilestones,
  type ALL_HISTORICAL__HeaderV1FetchParamTypes,
  ALL_HISTORICAL__HeaderV1RenderArgumentsExamples,
  type ALL_HISTORICAL__HeaderV1RenderArgumentsTypes,
  ALL_HISTORICAL__HeaderV1RenderMilestones,
  ALL_HISTORICAL__HeaderV1RenderReturnExamples,
  type ALL_HISTORICAL__HeaderV1RenderReturnTypes,
} from '../HISTORICAL_HEADER_V1_TYPES.js';
import type { DeepReadonly } from './testUtils.ts';

// The historical examples must match the historical typings

ALL_HISTORICAL__HeaderV1FetchParamExamples satisfies DeepReadonly<
  Array<ALL_HISTORICAL__HeaderV1FetchParamTypes>
>;

ALL_HISTORICAL__HeaderV1RenderArgumentsExamples satisfies DeepReadonly<
  Array<ALL_HISTORICAL__HeaderV1RenderArgumentsTypes>
>;

ALL_HISTORICAL__HeaderV1RenderReturnExamples satisfies DeepReadonly<
  Array<ALL_HISTORICAL__HeaderV1RenderReturnTypes>
>;

// Ensure that those historical examples include all milestones
// (If you missed one, it needs to be added to the bottom of `HISTORICAL_HEADER_V1_TYPES.ts`)

describe('HISTORICAL_HEADER_V1_TYPES', () => {
  test('ALL_HISTORICAL__HeaderV1FetchParamExamples includes all milestones', () => {
    const allExamplesFromAllMilestones = ALL_HISTORICAL__HeaderV1FetchParamMilestones.flatMap(
      (milestone) => milestone.examples,
    );
    expect(allExamplesFromAllMilestones.length).toEqual(
      ALL_HISTORICAL__HeaderV1FetchParamExamples.length,
    );
  });
  test('ALL_HISTORICAL__HeaderV1EntryExamples includes all milestones', () => {
    const allExamplesFromAllMilestones = ALL_HISTORICAL__HeaderV1RenderMilestones.flatMap(
      (milestone) => milestone.argumentsExamples,
    );
    expect(allExamplesFromAllMilestones.length).toEqual(
      ALL_HISTORICAL__HeaderV1RenderArgumentsExamples.length,
    );
  });
  test('ALL_HISTORICAL__HeaderV1PayloadExamples includes all milestones', () => {
    const allExamplesFromAllMilestones = ALL_HISTORICAL__HeaderV1RenderMilestones.flatMap(
      (milestone) => milestone.returnExamples,
    );
    expect(allExamplesFromAllMilestones.length).toEqual(
      ALL_HISTORICAL__HeaderV1RenderReturnExamples.length,
    );
  });
});

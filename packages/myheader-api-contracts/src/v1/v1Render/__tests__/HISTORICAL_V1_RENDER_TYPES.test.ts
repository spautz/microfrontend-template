import { describe, expect, test } from 'vitest';
import type { DeepReadonly } from '../../__tests__/testUtils.ts';
import {
  ALL_HISTORICAL__V1FetchParamExamples,
  ALL_HISTORICAL__V1FetchParamMilestones,
  type ALL_HISTORICAL__V1FetchParamTypes,
  ALL_HISTORICAL__V1RenderArgumentsExamples,
  type ALL_HISTORICAL__V1RenderArgumentsTypes,
  ALL_HISTORICAL__V1RenderMilestones,
  ALL_HISTORICAL__V1RenderReturnExamples,
  type ALL_HISTORICAL__V1RenderReturnTypes,
} from '../HISTORICAL_V1_RENDER_TYPES.ts';

// The historical examples must match the historical typings

ALL_HISTORICAL__V1FetchParamExamples satisfies DeepReadonly<
  Array<ALL_HISTORICAL__V1FetchParamTypes>
>;

ALL_HISTORICAL__V1RenderArgumentsExamples satisfies DeepReadonly<
  Array<ALL_HISTORICAL__V1RenderArgumentsTypes>
>;

ALL_HISTORICAL__V1RenderReturnExamples satisfies DeepReadonly<
  Array<ALL_HISTORICAL__V1RenderReturnTypes>
>;

// Ensure that those historical examples include all milestones
// (If you missed one, it needs to be added to the bottom of `HISTORICAL_V1_RENDER_TYPES.ts`)

describe('HISTORICAL_HEADER_V1_TYPES', () => {
  test('ALL_HISTORICAL__V1FetchParamExamples includes all milestones', () => {
    const allExamplesFromAllMilestones = ALL_HISTORICAL__V1FetchParamMilestones.flatMap(
      (milestone) => milestone.examples,
    );
    expect(allExamplesFromAllMilestones.length).toEqual(
      ALL_HISTORICAL__V1FetchParamExamples.length,
    );
  });
  test('ALL_HISTORICAL__V1EntryExamples includes all milestones', () => {
    const allExamplesFromAllMilestones = ALL_HISTORICAL__V1RenderMilestones.flatMap(
      (milestone) => milestone.argumentsExamples,
    );
    expect(allExamplesFromAllMilestones.length).toEqual(
      ALL_HISTORICAL__V1RenderArgumentsExamples.length,
    );
  });
  test('ALL_HISTORICAL__V1PayloadExamples includes all milestones', () => {
    const allExamplesFromAllMilestones = ALL_HISTORICAL__V1RenderMilestones.flatMap(
      (milestone) => milestone.returnExamples,
    );
    expect(allExamplesFromAllMilestones.length).toEqual(
      ALL_HISTORICAL__V1RenderReturnExamples.length,
    );
  });
});

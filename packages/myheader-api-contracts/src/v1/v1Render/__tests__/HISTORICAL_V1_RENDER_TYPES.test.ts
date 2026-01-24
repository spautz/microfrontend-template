import { describe, expect, test } from 'vitest';
import type { DeepReadonly } from '../../__tests__/testUtils.ts';
import {
  ALL_HISTORICAL__V1RenderArgumentsExamples,
  type ALL_HISTORICAL__V1RenderArgumentsTypes,
  ALL_HISTORICAL__V1RenderMilestones,
  ALL_HISTORICAL__V1RenderReturnExamples,
  type ALL_HISTORICAL__V1RenderReturnTypes,
} from '../HISTORICAL_V1_RENDER_TYPES.ts';
import { type V1Render, v1Render_argumentsSchema } from '../v1Render.ts';
import { v1Render_argumentsExamples, v1Render_returnExamples } from './v1Render.test.ts';

// Historical examples must match the historical typings

ALL_HISTORICAL__V1RenderArgumentsExamples satisfies DeepReadonly<
  Array<ALL_HISTORICAL__V1RenderArgumentsTypes>
>;

ALL_HISTORICAL__V1RenderReturnExamples satisfies DeepReadonly<
  Array<ALL_HISTORICAL__V1RenderReturnTypes>
>;

// Historical examples must still be valid
ALL_HISTORICAL__V1RenderArgumentsExamples satisfies DeepReadonly<Array<Parameters<V1Render>>>;
ALL_HISTORICAL__V1RenderReturnExamples satisfies DeepReadonly<Array<ReturnType<V1Render>>>;

// The current type must be assignable to all historical types
null as unknown as Parameters<V1Render> satisfies ALL_HISTORICAL__V1RenderArgumentsTypes;
null as unknown as ReturnType<V1Render> satisfies ALL_HISTORICAL__V1RenderReturnTypes;

// Current examples must still be valid against old contracts
v1Render_argumentsExamples satisfies Array<ALL_HISTORICAL__V1RenderArgumentsTypes>;
v1Render_returnExamples satisfies Array<ALL_HISTORICAL__V1RenderReturnTypes>;

// Ensure that those historical examples include all milestones
// (If you missed one, it needs to be added to the bottom of `HISTORICAL_V1_RENDER_TYPES.ts`)

describe('HISTORICAL_HEADER_V1_TYPES', () => {
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

  test.each(
    ALL_HISTORICAL__V1RenderArgumentsExamples,
  )('Historical argument examples all pass current schema (#%#)', (...exampleRenderArguments) => {
    const result = v1Render_argumentsSchema.safeParse(exampleRenderArguments);
    expect(result.error).toBeFalsy();
  });
});

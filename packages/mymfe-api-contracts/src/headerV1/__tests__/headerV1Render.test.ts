import { describe, expect, test } from 'vitest';
import {
  ALL_HISTORICAL__HeaderV1RenderArgumentsExamples,
  type ALL_HISTORICAL__HeaderV1RenderArgumentsTypes,
  ALL_HISTORICAL__HeaderV1RenderReturnExamples,
  type ALL_HISTORICAL__HeaderV1RenderReturnTypes,
} from '../HISTORICAL_HEADER_V1_TYPES.js';
import {
  type HeaderV1Render,
  headerV1Render_argumentsExamples,
  headerV1Render_argumentsSchema,
  headerV1Render_returnExamples,
} from '../headerV1Render.js';
import type { DeepReadonly } from './testUtils.ts';

// The current examples must match the current typings

headerV1Render_argumentsExamples satisfies Array<Parameters<HeaderV1Render>>;
headerV1Render_returnExamples satisfies Array<ReturnType<HeaderV1Render>>;

// Historical examples must still be valid
ALL_HISTORICAL__HeaderV1RenderArgumentsExamples satisfies DeepReadonly<
  Array<Parameters<HeaderV1Render>>
>;
ALL_HISTORICAL__HeaderV1RenderReturnExamples satisfies DeepReadonly<
  Array<ReturnType<HeaderV1Render>>
>;

// The current type must be assignable to all historical types
null as unknown as Parameters<HeaderV1Render> satisfies ALL_HISTORICAL__HeaderV1RenderArgumentsTypes;
null as unknown as ReturnType<HeaderV1Render> satisfies ALL_HISTORICAL__HeaderV1RenderReturnTypes;

// Current examples must still be valid against old contracts
headerV1Render_argumentsExamples satisfies Array<ALL_HISTORICAL__HeaderV1RenderArgumentsTypes>;
headerV1Render_returnExamples satisfies Array<ALL_HISTORICAL__HeaderV1RenderReturnTypes>;

// Finally, validate all examples against the schema
describe('HeaderV1 Render', () => {
  test.each(
    headerV1Render_argumentsExamples,
  )('Argument examples all pass current schema (#%#)', (...exampleRenderArguments) => {
    const result = headerV1Render_argumentsSchema.safeParse(exampleRenderArguments);
    expect(result.error).toBeFalsy();
  });

  test.each(
    ALL_HISTORICAL__HeaderV1RenderArgumentsExamples,
  )('Historical argument examples all pass current schema (#%#)', (...exampleRenderArguments) => {
    const result = headerV1Render_argumentsSchema.safeParse(exampleRenderArguments);
    expect(result.error).toBeFalsy();
  });
});

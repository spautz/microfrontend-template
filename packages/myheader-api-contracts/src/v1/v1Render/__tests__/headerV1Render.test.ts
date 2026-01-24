import { describe, expect, test } from 'vitest';
import type { DeepReadonly } from '../../__tests__/testUtils.ts';
import {
  ALL_HISTORICAL__V1RenderArgumentsExamples,
  type ALL_HISTORICAL__V1RenderArgumentsTypes,
  ALL_HISTORICAL__V1RenderReturnExamples,
  type ALL_HISTORICAL__V1RenderReturnTypes,
} from '../HISTORICAL_V1_RENDER_TYPES.ts';
import {
  type V1Render,
  v1Render_argumentsExamples,
  v1Render_argumentsSchema,
  v1Render_returnExamples,
} from '../v1Render.ts';

// The current examples must match the current typings

v1Render_argumentsExamples satisfies Array<Parameters<V1Render>>;
v1Render_returnExamples satisfies Array<ReturnType<V1Render>>;

// Historical examples must still be valid
ALL_HISTORICAL__V1RenderArgumentsExamples satisfies DeepReadonly<Array<Parameters<V1Render>>>;
ALL_HISTORICAL__V1RenderReturnExamples satisfies DeepReadonly<Array<ReturnType<V1Render>>>;

// The current type must be assignable to all historical types
null as unknown as Parameters<V1Render> satisfies ALL_HISTORICAL__V1RenderArgumentsTypes;
null as unknown as ReturnType<V1Render> satisfies ALL_HISTORICAL__V1RenderReturnTypes;

// Current examples must still be valid against old contracts
v1Render_argumentsExamples satisfies Array<ALL_HISTORICAL__V1RenderArgumentsTypes>;
v1Render_returnExamples satisfies Array<ALL_HISTORICAL__V1RenderReturnTypes>;

// Finally, validate all examples against the schema
describe('V1 Render', () => {
  test.each(
    v1Render_argumentsExamples,
  )('Argument examples all pass current schema (#%#)', (...exampleRenderArguments) => {
    const result = v1Render_argumentsSchema.safeParse(exampleRenderArguments);
    expect(result.error).toBeFalsy();
  });

  test.each(
    ALL_HISTORICAL__V1RenderArgumentsExamples,
  )('Historical argument examples all pass current schema (#%#)', (...exampleRenderArguments) => {
    const result = v1Render_argumentsSchema.safeParse(exampleRenderArguments);
    expect(result.error).toBeFalsy();
  });
});

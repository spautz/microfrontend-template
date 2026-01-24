import { describe, expect, test } from 'vitest';

import { type V1Render, v1Render_argumentsSchema } from '../v1Render.ts';

/**
 * Some examples of full arguments to v1's render(), used for testing.
 */
export const v1Render_argumentsExamples: Array<Parameters<V1Render>> = [
  [
    {
      rootElement: document.createElement('div'),
      currentUrlPath: '',
    },
  ],
  [
    {
      rootElement: document.createElement('span'),
      currentUrlPath: '/',
    },
  ],
  [
    {
      rootElement: document.createElement('main'),
      currentUrlPath: '/foo/bar',
    },
  ],
  [
    {
      rootElement: document.createElement('section'),
      currentUrlPath: '/foo/bar/',
    },
  ],
] as const;

/**
 * Some examples of the value returned from v1's render(), used for testing.
 */
export const v1Render_returnExamples: Array<ReturnType<V1Render>> = [
  (_newOptions: { currentUrlPath?: string }) => {},
];

// The current examples must match the current typings

v1Render_argumentsExamples satisfies Array<Parameters<V1Render>>;
v1Render_returnExamples satisfies Array<ReturnType<V1Render>>;

// Finally, validate all examples against the schema
describe('V1 Render', () => {
  test.each(
    v1Render_argumentsExamples,
  )('Argument examples all pass current schema (#%#)', (...exampleRenderArguments) => {
    const result = v1Render_argumentsSchema.safeParse(exampleRenderArguments);
    expect(result.error).toBeFalsy();
  });
});

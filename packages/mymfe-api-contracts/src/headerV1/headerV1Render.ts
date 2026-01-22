import z from 'zod/v4';

/*
 * This file records the signature of the HeaderV1 microfrontend's `render` function:
 * its `arguments` and `return`.
 */

/**
 * render() accepts an options argument
 */
type HeaderV1Render_Arguments = [
  {
    rootElement: HTMLElement;
    currentUrlPath: string;
  },
];

/**
 * render() returns a function to update (some) options if their values change later
 */
type HeaderV1Render_Return = (options: { currentUrlPath?: string }) => void;

type HeaderV1Render = (options: HeaderV1Render_Arguments[0]) => HeaderV1Render_Return;

const headerV1Render_argumentsSchema = z.tuple([
  z.looseObject({
    rootElement: z.instanceof(HTMLElement),
    currentUrlPath: z.string(),
  }),
]);

/**
 * Some examples of full arguments to headerV1's render(), used for testing.
 */
const headerV1Render_argumentsExamples: Array<HeaderV1Render_Arguments> = [
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
 * Some examples of the value returned from headerV1's render(), used for testing.
 */
const headerV1Render_returnExamples: Array<HeaderV1Render_Return> = [
  (_newOptions: { currentUrlPath?: string }) => {},
];

export type { HeaderV1Render };
export {
  headerV1Render_argumentsSchema,
  headerV1Render_argumentsExamples,
  headerV1Render_returnExamples,
};

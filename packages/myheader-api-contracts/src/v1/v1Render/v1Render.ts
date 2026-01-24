import z from 'zod/v4';

/*
 * This file records the signature of the V1 microfrontend's `render` function:
 * its `arguments` and `return`.
 */

/**
 * render() accepts an options argument
 */
type V1Render_Arguments = [
  {
    rootElement: HTMLElement;
    currentUrlPath: string;
  },
];

/**
 * render() returns a function to update (some) options if their values change later
 */
type V1Render_Return = (options: { currentUrlPath?: string }) => void;

type V1Render = (options: V1Render_Arguments[0]) => V1Render_Return;

const v1Render_argumentsSchema = z.tuple([
  z.looseObject({
    rootElement: z.looseObject({}), // z.instanceof(HTMLElement),
    currentUrlPath: z.string(),
  }),
]);

export type { V1Render };
export { v1Render_argumentsSchema };

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
    initialUrlPath: string;
    onNavLinkClick?: (nextUrlPath: string, e: Event) => void;
  },
];

/**
 * render() returns a function to update (some) options if their values change later
 */
type V1Render_Return = (newOptions: { newUrlPath?: string }) => void;

type V1Render = (options: V1Render_Arguments[0]) => V1Render_Return;

const v1Render_argumentsSchema = z.tuple([
  z.looseObject({
    rootElement: z.looseObject({}), // z.instanceof(HTMLElement),
    initialUrlPath: z.string(),
  }),
]);

export type { V1Render };
export { v1Render_argumentsSchema };

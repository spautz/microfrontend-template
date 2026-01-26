import z from 'zod/v4';

/*
 * This file records typings for the microfrontend's v1Header functions:
 *  v1Header_mount()
 *  v1Header_rehydrate()
 *  v1Header_prerender()
 *
 * Each has an `Options` interface and a `Return` type.
 */

/**
 * All Header functions accept these options
 */
interface V1Header_BaseOptions {
  /**
   * The link to show as active
   */
  initialUrlPath: string | null;
}

/**
 * An environment-safe util to create dom elements (or placeholders for them)
 * even in non-browser environments
 */
const createElement = (elementType: string): HTMLElement => {
  if (typeof document === 'undefined' || !document.createElement) {
    return null as unknown as HTMLElement;
  }
  return document.createElement(elementType);
};

///////////////////////////////////////////////////////////////////////////////////////////////////
// v1Header_mount() accepts browser-specific values

interface V1Header_MountOptions extends V1Header_BaseOptions {
  /**
   * DOM element to render into
   */
  rootElement: HTMLElement;
  /**
   * Callback for when a nav link is clicked. The caller can use this to intercept clicks and
   * navigate internally instead, if desired.
   */
  onNavLinkClick?: ((nextUrlPath: string, e: Event) => void) | undefined;
}

type V1Header_MountReturn = {
  /**
   * A function that the caller can use to update (some) options, if their values change later.
   * This could be used to pass a new urlPath.
   */
  setNewOptions: (newOptions: { newUrlPath?: string }) => void;

  /**
   * The React Root's `unmount`
   */
  unmount(): void;
};

/**
 * Schemas are loose to allow future options: a caller is allowed to pass things we don't know
 * about yet.
 */
const v1Header_mountOptionsSchema = z.looseObject({
  initialUrlPath: z.string(),
  rootElement: typeof HTMLElement === 'undefined' ? z.object() : z.instanceof(HTMLElement),
  onNavLinkClick: z.function().optional(),
});

/**
 * Some examples of mount options, used for testing.
 */
const v1Header_mountOptionsExamples = [
  {
    rootElement: createElement('div'),
    initialUrlPath: null,
  },
  {
    rootElement: createElement('span'),
    initialUrlPath: '/',
    onNavLinkClick: (_nextUrlPath: string, e: Event) => {
      e.preventDefault();
    },
  },
  {
    rootElement: createElement('main'),
    initialUrlPath: '/foo/bar/',
  },
] as const;

///////////////////////////////////////////////////////////////////////////////////////////////////
// v1Header_rehydrate() has the same signature as v1Header_mount()

interface V1Header_RehydrateOptions extends V1Header_MountOptions {}

type V1Header_RehydrateReturn = V1Header_MountReturn;

const v1Header_rehydrateOptionsSchema = v1Header_mountOptionsSchema;

/**
 * Some examples of rehydrate options, used for testing.
 */
const v1Header_rehydrateOptionsExamples = [...v1Header_mountOptionsExamples] as const;

///////////////////////////////////////////////////////////////////////////////////////////////////
// v1Header_prerender()

interface V1Header_PrerenderOptions extends V1Header_BaseOptions {}

type V1Header_PrerenderReturn = undefined;

/**
 Schemas are loose to allow future options: a caller is allowed to pass things we don't know
 about yet.
 */
const v1Header_prerenderOptionsSchema = z.looseObject({
  initialUrlPath: z.string(),
});

/**
 * Some examples of prerender options, used for testing.
 */
const v1Header_prerenderOptionsExamples = [
  {
    initialUrlPath: null,
  },
  {
    initialUrlPath: '/',
  },
  {
    initialUrlPath: '/foo/bar/',
  },
] as const;

///////////////////////////////////////////////////////////////////////////////////////////////////

export type {
  V1Header_MountOptions,
  V1Header_MountReturn,
  V1Header_RehydrateOptions,
  V1Header_RehydrateReturn,
  V1Header_PrerenderOptions,
  V1Header_PrerenderReturn,
};
export {
  v1Header_mountOptionsSchema,
  v1Header_rehydrateOptionsSchema,
  v1Header_prerenderOptionsSchema,
  v1Header_mountOptionsExamples,
  v1Header_rehydrateOptionsExamples,
  v1Header_prerenderOptionsExamples,
};

/*
 * This file has two strict rules:
 *
 *  1) ONLY ADD, NEVER MODIFY
 *    This file stores the past history of Header typings for the microfrontend.
 *    It's used to ensure that future updates do not break existing consumers.
 *    (If you truly need a breaking change, you should make a new top-level version: V1 -> V2)
 *
 *  2) NO IMPORTS
 *    This file should *duplicate* everything locally: do not import or single-source types
 *    from elsewhere. If those types change in the future, we want these to *not* be in-sync,
 *    so that tests fail if the change isn't backwards-compatible.
 *
 * The type and variable names here are intentionally weird, so that they'll stand out in a PR
 * if somebody changes or references them.
 * Naming convention: `HISTORICAL__{NameOfTypeOrValue}__{MILESTONE_NAME}`
 */

/**
 * An environment-safe util to create dom elements (or mock placeholders for them) in both
 * browser and non-browser environments. Useful for tests and example values.
 */
const createElement = (elementType: string): HTMLElement => {
  if (typeof document === 'undefined' || !document.createElement) {
    return null as unknown as HTMLElement;
  }
  return document.createElement(elementType);
};

///////////////////////////////////////////////////////////////////////////////////////////////////
// v1Header_mount: Options & Return
//
// Do not use Zod or other libraries: you must manually copy over the typings when they change.
// (This is intentionally painful: you should generally never need to change things once set up.)

/*
 * "ORIGINAL" milestone
 * 2026.01: Initial contract.
 */
type HISTORICAL__V1HeaderMountOptions__ORIGINAL = {
  rootElement: HTMLElement;
  initialUrlPath: string | null;
  onNavLinkClick?: (nextUrlPath: string, e: Event) => void;
};

type HISTORICAL__V1HeaderMountReturn__ORIGINAL = {
  setNewOptions: (newOptions: { newUrlPath?: string }) => void;
  unmount(): void;
};

// This structure tracks types + examples as a single unit, to make bulk tests easier.
const HISTORICAL__v1HeaderMount__ORIGINAL = {
  milestoneName: 'ORIGINAL',
  optionsType: null as unknown as HISTORICAL__V1HeaderMountOptions__ORIGINAL,
  returnType: null as unknown as HISTORICAL__V1HeaderMountReturn__ORIGINAL,
  optionsExamples: [
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
  ] as const satisfies ReadonlyArray<HISTORICAL__V1HeaderMountOptions__ORIGINAL>,
  returnExamples: [
    {
      setNewOptions: (_newOptions: { newUrlPath?: string }) => {},
      unmount: () => {},
    },
  ] as const satisfies ReadonlyArray<HISTORICAL__V1HeaderMountReturn__ORIGINAL>,
} as const;

/**
 * A list of all historical milestones for V1's mount().
 * Usually there'll only be one, which we never need to change.
 */
const ALL_HISTORICAL__v1HeaderMountMilestones = [HISTORICAL__v1HeaderMount__ORIGINAL] as const;

///////////////////////////////////////////////////////////////////////////////////////////////////
// v1Header_rehydrate: Options & Return
//
// Do not use Zod or other libraries: you must manually copy over the typings when they change.
// (This is intentionally painful: you should generally never need to change things once set up.)

/*
 * "ORIGINAL" milestone
 * 2026.01: Initial contract.
 */
type HISTORICAL__V1HeaderRehydrateOptions__ORIGINAL = {
  rootElement: HTMLElement;
  initialUrlPath: string | null;
  onNavLinkClick?: (nextUrlPath: string, e: Event) => void;
};

type HISTORICAL__V1HeaderRehydrateReturn__ORIGINAL = {
  setNewOptions: (newOptions: { newUrlPath?: string }) => void;
  unmount(): void;
};

// This structure tracks types + examples as a single unit, to make bulk tests easier.
const HISTORICAL__v1HeaderRehydrate__ORIGINAL = {
  milestoneName: 'ORIGINAL',
  optionsType: null as unknown as HISTORICAL__V1HeaderRehydrateOptions__ORIGINAL,
  returnType: null as unknown as HISTORICAL__V1HeaderRehydrateReturn__ORIGINAL,
  optionsExamples: [
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
  ] as const satisfies ReadonlyArray<HISTORICAL__V1HeaderRehydrateOptions__ORIGINAL>,
  returnExamples: [
    {
      setNewOptions: (_newOptions: { newUrlPath?: string }) => {},
      unmount: () => {},
    },
  ] as const satisfies ReadonlyArray<HISTORICAL__V1HeaderRehydrateReturn__ORIGINAL>,
} as const;

/**
 * A list of all historical milestones for V1's rehydrate().
 * Usually there'll only be one, which we never need to change.
 */
const ALL_HISTORICAL__v1HeaderRehydrateMilestones = [
  HISTORICAL__v1HeaderRehydrate__ORIGINAL,
] as const;

///////////////////////////////////////////////////////////////////////////////////////////////////
// v1Header_prerender: Options & Return
//
// Do not use Zod or other libraries: you must manually copy over the typings when they change.
// (This is intentionally painful: you should generally never need to change things once set up.)

/*
 * "ORIGINAL" milestone
 * 2026.01: Initial contract.
 */
type HISTORICAL__V1HeaderPrerenderOptions__ORIGINAL = {
  initialUrlPath: string | null;
};

type HISTORICAL__V1HeaderPrerenderReturn__ORIGINAL = undefined;

// This structure tracks types + examples as a single unit, to make bulk tests easier.
const HISTORICAL__v1HeaderPrerender__ORIGINAL = {
  milestoneName: 'ORIGINAL',
  optionsType: null as unknown as HISTORICAL__V1HeaderPrerenderOptions__ORIGINAL,
  returnType: null as unknown as HISTORICAL__V1HeaderPrerenderReturn__ORIGINAL,
  optionsExamples: [
    {
      initialUrlPath: null,
    },
    {
      initialUrlPath: '/',
    },
    {
      initialUrlPath: '/foo/bar/',
    },
  ] as const satisfies ReadonlyArray<HISTORICAL__V1HeaderPrerenderOptions__ORIGINAL>,
  returnExamples: [
    undefined,
  ] as const satisfies ReadonlyArray<HISTORICAL__V1HeaderPrerenderReturn__ORIGINAL>,
} as const;

/**
 * A list of all historical milestones for V1's prerender().
 * Usually there'll only be one, which we never need to change.
 */
const ALL_HISTORICAL__v1HeaderPrerenderMilestones = [
  HISTORICAL__v1HeaderPrerender__ORIGINAL,
] as const;

///////////////////////////////////////////////////////////////////////////////////////////////////
// Rearrange for export
// The "ALL_HISTORICAL__" structures above work better for recording milestones, but for
// reading/processing/testing it's easier when types and examples are separated.

type ALL_HISTORICAL__V1HeaderMountOptionsTypes =
  (typeof ALL_HISTORICAL__v1HeaderMountMilestones)[number]['optionsType'];
type ALL_HISTORICAL__V1HeaderMountReturnTypes =
  (typeof ALL_HISTORICAL__v1HeaderMountMilestones)[number]['returnType'];
type ALL_HISTORICAL__V1HeaderRehydrateOptionsTypes =
  (typeof ALL_HISTORICAL__v1HeaderRehydrateMilestones)[number]['optionsType'];
type ALL_HISTORICAL__V1HeaderRehydrateReturnTypes =
  (typeof ALL_HISTORICAL__v1HeaderRehydrateMilestones)[number]['returnType'];
type ALL_HISTORICAL__V1HeaderPrerenderOptionsTypes =
  (typeof ALL_HISTORICAL__v1HeaderPrerenderMilestones)[number]['optionsType'];
type ALL_HISTORICAL__V1HeaderPrerenderReturnTypes =
  (typeof ALL_HISTORICAL__v1HeaderPrerenderMilestones)[number]['returnType'];

// We use a spread to preserve the "as const" types from the examples.
// When adding a new milestone above, you MUST add the new index here.
// (The unit tests double-check that nothing was omitted)
const ALL_HISTORICAL__v1HeaderMountOptionsExamples = [
  ...ALL_HISTORICAL__v1HeaderMountMilestones[0].optionsExamples,
] as const;
const ALL_HISTORICAL__v1HeaderMountReturnExamples = [
  ...ALL_HISTORICAL__v1HeaderMountMilestones[0].returnExamples,
] as const;
const ALL_HISTORICAL__v1HeaderRehydrateOptionsExamples = [
  ...ALL_HISTORICAL__v1HeaderRehydrateMilestones[0].optionsExamples,
] as const;
const ALL_HISTORICAL__v1HeaderRehydrateReturnExamples = [
  ...ALL_HISTORICAL__v1HeaderRehydrateMilestones[0].returnExamples,
] as const;
const ALL_HISTORICAL__v1HeaderPrerenderOptionsExamples = [
  ...ALL_HISTORICAL__v1HeaderPrerenderMilestones[0].optionsExamples,
] as const;
const ALL_HISTORICAL__v1HeaderPrerenderReturnExamples = [
  ...ALL_HISTORICAL__v1HeaderPrerenderMilestones[0].returnExamples,
] as const;

/*
 * DO NOT IMPORT THESE EXCEPT FOR TESTING!
 * See the note at the top of this file for more.
 */
export {
  type ALL_HISTORICAL__V1HeaderMountOptionsTypes,
  type ALL_HISTORICAL__V1HeaderMountReturnTypes,
  type ALL_HISTORICAL__V1HeaderRehydrateOptionsTypes,
  type ALL_HISTORICAL__V1HeaderRehydrateReturnTypes,
  type ALL_HISTORICAL__V1HeaderPrerenderOptionsTypes,
  type ALL_HISTORICAL__V1HeaderPrerenderReturnTypes,
  ALL_HISTORICAL__v1HeaderMountMilestones,
  ALL_HISTORICAL__v1HeaderMountOptionsExamples,
  ALL_HISTORICAL__v1HeaderMountReturnExamples,
  ALL_HISTORICAL__v1HeaderRehydrateMilestones,
  ALL_HISTORICAL__v1HeaderRehydrateOptionsExamples,
  ALL_HISTORICAL__v1HeaderRehydrateReturnExamples,
  ALL_HISTORICAL__v1HeaderPrerenderMilestones,
  ALL_HISTORICAL__v1HeaderPrerenderOptionsExamples,
  ALL_HISTORICAL__v1HeaderPrerenderReturnExamples,
};

/*
 * This file has two strict rules:
 *
 *  1) ONLY ADD, NEVER MODIFY
 *    This file stores the past history of fetch params and exports for the microfrontend.
 *    It's used to ensure that future updates do not break existing consumers.
 *    (If there is truly a breaking change, you should make a new top-level version: V1 -> V2)
 *
 *  2) NO IMPORTS
 *    This file should *duplicate* everything locally: do not import or single-source types
 *    from elsewhere. If those types change in the future, we want these to *not* be in-sync,
 *    so that tests fail if the change isn't backwards-compatible.
 *
 * The type and variable names here are _intentionally weird_ (especially in casing),
 * so that they'll stand out in a PR if somebody changes or references them.
 * Naming convention: `HISTORICAL__{NameOfTypeOrValue}__{MilestoneName}`
 */

///////////////////////////////////////////////////////////////////////////////////////////////////
// HeaderV1 Fetch params

/**
 * "ORIGINAL" milestone
 * 2026.01: Optional locale.
 */
type HISTORICAL__HeaderV1FetchParamsType__ORIGINAL = {
  locale?: undefined | null | 'de-DE' | 'en-GB' | 'en-US' | 'es-ES' | 'fr-FR';
};

// This tracks types + examples as a single unit, to make tests easier.
const HISTORICAL__HeaderV1FetchParams__ORIGINAL = {
  milestoneName: 'ORIGINAL',
  type: null as unknown as HISTORICAL__HeaderV1FetchParamsType__ORIGINAL,
  examples: [
    {},
    { locale: undefined },
    { locale: null },
    { locale: 'de-DE' },
    { locale: 'en-GB' },
    { locale: 'en-US' },
    { locale: 'es-ES' },
    { locale: 'fr-FR' },
  ],
} as const;

/**
 * A list of all historical milestones for HeaderV1 fetch params.
 * Usually there'll only be one, which we never need to change.
 */
const ALL_HISTORICAL__HeaderV1FetchParamMilestones = [
  HISTORICAL__HeaderV1FetchParams__ORIGINAL,
] as const;

///////////////////////////////////////////////////////////////////////////////////////////////////
// HeaderV1 Render: Arguments & Return
//
// Do not use Zod or any other external tools here: you must manually copy over the typings when they change.
// (This is intentionally painful: you should generally never need to change things once set up.)

/**
 * "ORIGINAL" milestone
 * 2026.01: Initial fields.
 */
type HISTORICAL__HeaderV1RenderType__ORIGINAL = (options: {
  rootElement: HTMLElement;
  currentUrlPath: string;
}) => (newOptions: { currentUrlPath?: string }) => void;

const HISTORICAL__HeaderV1Render__ORIGINAL = {
  milestoneName: 'ORIGINAL',
  argumentsType: null as unknown as Parameters<HISTORICAL__HeaderV1RenderType__ORIGINAL>,
  returnType: null as unknown as ReturnType<HISTORICAL__HeaderV1RenderType__ORIGINAL>,
  argumentsExamples: [
    [
      {
        rootElement: document.createElement('div') as HTMLDivElement,
        currentUrlPath: '',
      },
    ],
    [
      {
        rootElement: document.createElement('div') as HTMLDivElement,
        currentUrlPath: '/',
      },
    ],
    [
      {
        rootElement: document.createElement('div') as HTMLDivElement,
        currentUrlPath: '/foo/bar',
      },
    ],
    [
      {
        rootElement: document.createElement('div') as HTMLDivElement,
        currentUrlPath: '/foo/bar/',
      },
    ],
  ] as const satisfies ReadonlyArray<Parameters<HISTORICAL__HeaderV1RenderType__ORIGINAL>>,
  returnExamples: [(_newOptions: { currentUrlPath?: string }) => {}],
};

/**
 * A list of all historical milestones for HeaderV1's render().
 * Usually there'll only be one, which we never need to change.
 */
const ALL_HISTORICAL__HeaderV1RenderMilestones = [HISTORICAL__HeaderV1Render__ORIGINAL] as const;

///////////////////////////////////////////////////////////////////////////////////////////////////
// Rearrange for export
// The "ALL_HISTORICAL__" values above work better for recording milestones, but for reading/processing/testing
// it's easier when types and examples are separated.

type ALL_HISTORICAL__HeaderV1FetchParamTypes =
  (typeof ALL_HISTORICAL__HeaderV1FetchParamMilestones)[number]['type'];
type ALL_HISTORICAL__HeaderV1RenderArgumentsTypes =
  (typeof ALL_HISTORICAL__HeaderV1RenderMilestones)[number]['argumentsType'];
type ALL_HISTORICAL__HeaderV1RenderReturnTypes =
  (typeof ALL_HISTORICAL__HeaderV1RenderMilestones)[number]['returnType'];

// We use a spread to preserve the "as const" types from the examples (iterating over the array loses them).
// When adding a new milestone above, you MUST add the new index here.
// (Tests double-check that nothing was omitted)
const ALL_HISTORICAL__HeaderV1FetchParamExamples = [
  ...ALL_HISTORICAL__HeaderV1FetchParamMilestones[0].examples,
] as const;
const ALL_HISTORICAL__HeaderV1RenderArgumentsExamples = [
  ...ALL_HISTORICAL__HeaderV1RenderMilestones[0].argumentsExamples,
] as const;
const ALL_HISTORICAL__HeaderV1RenderReturnExamples = [
  ...ALL_HISTORICAL__HeaderV1RenderMilestones[0].returnExamples,
] as const;

/*
 * DO NOT IMPORT THESE EXCEPT FOR TESTING!
 * See the note at the top of this file for more.
 */
export {
  type ALL_HISTORICAL__HeaderV1FetchParamTypes,
  type ALL_HISTORICAL__HeaderV1RenderArgumentsTypes,
  type ALL_HISTORICAL__HeaderV1RenderReturnTypes,
  ALL_HISTORICAL__HeaderV1FetchParamMilestones,
  ALL_HISTORICAL__HeaderV1RenderMilestones,
  ALL_HISTORICAL__HeaderV1FetchParamExamples,
  ALL_HISTORICAL__HeaderV1RenderArgumentsExamples,
  ALL_HISTORICAL__HeaderV1RenderReturnExamples,
};

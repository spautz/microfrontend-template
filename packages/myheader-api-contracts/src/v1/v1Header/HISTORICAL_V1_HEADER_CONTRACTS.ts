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
// V1 Render: Arguments & Return
//
// Do not use Zod or other libraries: you must manually copy over the typings when they change.
// (This is intentionally painful: you should generally never need to change things once set up.)

/**
 * "ORIGINAL" milestone
 * 2026.01: Initial fields.
 */
type HISTORICAL__V1RenderType__ORIGINAL = (options: {
  rootElement: HTMLElement;
  initialUrlPath: string;
  onNavLinkClick?: (nextUrlPath: string, e: Event) => void;
}) => (newOptions: { newUrlPath?: string }) => void;

const HISTORICAL__V1Render__ORIGINAL = {
  milestoneName: 'ORIGINAL',
  argumentsType: null as unknown as Parameters<HISTORICAL__V1RenderType__ORIGINAL>,
  returnType: null as unknown as ReturnType<HISTORICAL__V1RenderType__ORIGINAL>,
  argumentsExamples: [
    [
      {
        rootElement: document.createElement('div') as HTMLDivElement,
        initialUrlPath: '',
      },
    ],
    [
      {
        rootElement: document.createElement('div') as HTMLDivElement,
        initialUrlPath: '/',
        onNavLinkClick: (_nextUrlPath: string, e: Event) => {
          e.preventDefault();
        },
      },
    ],
    [
      {
        rootElement: document.createElement('div') as HTMLDivElement,
        initialUrlPath: '/foo/bar',
      },
    ],
    [
      {
        rootElement: document.createElement('div') as HTMLDivElement,
        initialUrlPath: '/foo/bar/',
      },
    ],
  ] as const satisfies ReadonlyArray<Parameters<HISTORICAL__V1RenderType__ORIGINAL>>,
  returnExamples: [(_newOptions: { newUrlPath?: string }) => {}],
};

/**
 * A list of all historical milestones for V1's render().
 * Usually there'll only be one, which we never need to change.
 */
const ALL_HISTORICAL__V1RenderMilestones = [HISTORICAL__V1Render__ORIGINAL] as const;

///////////////////////////////////////////////////////////////////////////////////////////////////
// Rearrange for export
// The "ALL_HISTORICAL__" values above work better for recording milestones, but for reading/processing/testing
// it's easier when types and examples are separated.

type ALL_HISTORICAL__V1RenderArgumentsTypes =
  (typeof ALL_HISTORICAL__V1RenderMilestones)[number]['argumentsType'];
type ALL_HISTORICAL__V1RenderReturnTypes =
  (typeof ALL_HISTORICAL__V1RenderMilestones)[number]['returnType'];

// We use a spread to preserve the "as const" types from the examples (iterating over the array loses them).
// When adding a new milestone above, you MUST add the new index here.
// (Tests double-check that nothing was omitted)
const ALL_HISTORICAL__V1RenderArgumentsExamples = [
  ...ALL_HISTORICAL__V1RenderMilestones[0].argumentsExamples,
] as const;
const ALL_HISTORICAL__V1RenderReturnExamples = [
  ...ALL_HISTORICAL__V1RenderMilestones[0].returnExamples,
] as const;

/*
 * DO NOT IMPORT THESE EXCEPT FOR TESTING!
 * See the note at the top of this file for more.
 */
export {
  type ALL_HISTORICAL__V1RenderArgumentsTypes,
  type ALL_HISTORICAL__V1RenderReturnTypes,
  ALL_HISTORICAL__V1RenderMilestones,
  ALL_HISTORICAL__V1RenderArgumentsExamples,
  ALL_HISTORICAL__V1RenderReturnExamples,
};

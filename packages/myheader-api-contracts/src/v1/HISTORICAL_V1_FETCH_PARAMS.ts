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
// V1 Fetch params

/**
 * "ORIGINAL" milestone
 * 2026.01: Optional locale.
 */
type HISTORICAL__V1FetchParamsType__ORIGINAL = {
  locale?: undefined | null | 'de-DE' | 'en-GB' | 'en-US' | 'es-ES';
};

// This tracks types + examples as a single unit, to make tests easier.
const HISTORICAL__v1FetchParams__ORIGINAL = {
  milestoneName: 'ORIGINAL',
  type: null as unknown as HISTORICAL__V1FetchParamsType__ORIGINAL,
  examples: [
    {},
    { locale: undefined },
    { locale: null },
    { locale: 'de-DE' },
    { locale: 'en-GB' },
    { locale: 'en-US' },
    { locale: 'es-ES' },
  ] as const satisfies ReadonlyArray<HISTORICAL__V1FetchParamsType__ORIGINAL>,
} as const;

/**
 * A list of all historical milestones for V1 fetch params.
 * Usually there'll only be one, which we never need to change.
 */
const ALL_HISTORICAL__v1FetchParamsMilestones = [HISTORICAL__v1FetchParams__ORIGINAL] as const;

///////////////////////////////////////////////////////////////////////////////////////////////////
// Rearrange for export
// The "ALL_HISTORICAL__" values above work better for recording milestones, but for reading/processing/testing
// it's easier when types and examples are separated.

type ALL_HISTORICAL__V1FetchParamsTypes =
  (typeof ALL_HISTORICAL__v1FetchParamsMilestones)[number]['type'];

// We use a spread to preserve the "as const" types from the examples (iterating over the array loses them).
// When adding a new milestone above, you MUST add the new index here.
// (Tests double-check that nothing was omitted)
const ALL_HISTORICAL__v1FetchParamsExamples = [
  ...ALL_HISTORICAL__v1FetchParamsMilestones[0].examples,
] as const;

/*
 * DO NOT IMPORT THESE EXCEPT FOR TESTING!
 * See the note at the top of this file for more.
 */
export {
  type ALL_HISTORICAL__V1FetchParamsTypes,
  ALL_HISTORICAL__v1FetchParamsMilestones,
  ALL_HISTORICAL__v1FetchParamsExamples,
};

/*
 * This file has two strict rules:
 *
 *  1) ONLY ADD, NEVER MODIFY
 *    This file stores the past history of API contracts and example values.
 *    It's used to ensure that newer versions of the configs do not break existing consumers.
 *    (If there is truly a breaking change, you should make a new top-level version: V1 -> V2)
 *
 *  2) NO IMPORTS
 *    This file should *duplicate* everything locally: do not import or single-source types
 *    from elsewhere. If those types change in the future, we want these to *not* change,
 *    so that tests fail if the change isn't backwards-compatible.
 *
 * The type and variable names here are _intentionally weird_ (especially in casing),
 * so that they'll stand out in a PR if somebody changes or references them.
 * Naming convention: `HISTORICAL__{NameOfTypeOrValue}__{MilestoneName}`
 */

///////////////////////////////////////////////////////////////////////////////////////////////////
// Fetch params

/**
 * "ORIGINAL" milestone
 * 2026.01: No parameters are needed when loading beverage info.
 */
type HISTORICAL__BeverageV1FetchParamsType__ORIGINAL = undefined | Record<never, never>;

// This tracks types + example payloads as a single unit, to make tests easier.
const HISTORICAL__BeverageV1FetchParams__ORIGINAL = {
  milestoneName: 'ORIGINAL',
  type: null as unknown as HISTORICAL__BeverageV1FetchParamsType__ORIGINAL,
  examples: [undefined, {}],
} as const;

/**
 * A list of all historical milestones for BeverageV1 fetch params.
 * Usually there'll only be one, which we never need to change.
 */
const ALL_HISTORICAL__BeverageV1FetchParamMilestones = [
  HISTORICAL__BeverageV1FetchParams__ORIGINAL,
] as const;

///////////////////////////////////////////////////////////////////////////////////////////////////
// Nested Values
//
// Do not use Zod or any other external tools here: you must manually copy over the typings when they change.
// (This is intentionally painful: you should generally never need to change things once set up.)

/**
 * "ORIGINAL" milestone
 * 2026.01: Initial fields.
 */
type HISTORICAL__BeverageV1EntryType__ORIGINAL = {
  schemaVersion: 1;
  translations: {
    'en-US': {
      label: string;
      description: string;
    };
    'es-ES'?: {
      label: string;
      description: string;
    };
    'fr-FR'?: {
      label: string;
      description: string;
    };
    'de-DE'?: {
      label: string;
      description: string;
    };
  };
  isAlcoholic: boolean;
  isAvailable: boolean;
};

const HISTORICAL__BeverageV1Entry__ORIGINAL = {
  milestoneName: 'ORIGINAL',
  type: null as unknown as HISTORICAL__BeverageV1EntryType__ORIGINAL,
  examples: [
    {
      schemaVersion: 1,
      translations: {
        'en-US': {
          label: 'Black Tea',
          description: 'A hearty cup of English tea.',
        },
      },
      isAlcoholic: false,
      isAvailable: false,
    },
    {
      schemaVersion: 1,
      translations: {
        'en-US': {
          label: 'Green Tea',
          description: 'A light cup of tea.',
        },
        'es-ES': {
          label: 'Té verde',
          description: 'Una taza de té ligero.',
        },
      },
      isAlcoholic: false,
      isAvailable: true,
    },
    {
      schemaVersion: 1,
      translations: {
        'en-US': {
          label: 'Beer',
          description: 'A standard beer.',
        },
        'es-ES': {
          label: 'Cerveza',
          description: 'Una cerveza normal.',
        },
        'fr-FR': {
          label: 'Bière',
          description: 'Une bière ordinaire.',
        },
        'de-DE': {
          label: 'Bier',
          description: 'Ein Standardbier.',
        },
      },
      isAlcoholic: true,
      isAvailable: true,
    },
  ],
} as const;

/**
 * A list of all historical milestones for nested beverage data.
 * Usually there'll only be one, which we never need to change.
 */
const ALL_HISTORICAL__BeverageV1EntryMilestones = [HISTORICAL__BeverageV1Entry__ORIGINAL] as const;

///////////////////////////////////////////////////////////////////////////////////////////////////
// Full BeverageV1 Payloads
//
// Do not use Zod or any other external tools here: you must manually copy over the typings when they change.
// (This is intentionally painful: you should generally never need to change things once set up.)

/**
 * "ORIGINAL" milestone
 * 2026.01: Initial fields.
 */
type HISTORICAL__BeverageV1PayloadType__ORIGINAL = {
  lastUpdatedAt: string;
  beverages: Array<HISTORICAL__BeverageV1EntryType__ORIGINAL>;
};

const HISTORICAL__BeverageV1Payload__ORIGINAL = {
  milestoneName: 'ORIGINAL',
  type: null as unknown as HISTORICAL__BeverageV1PayloadType__ORIGINAL,
  examples: [
    {
      lastUpdatedAt: '2026-01-01T00:00:00.000Z',
      beverages: [],
    },
    {
      lastUpdatedAt: '2026-01-02T00:00:00.000Z',
      beverages: [HISTORICAL__BeverageV1Entry__ORIGINAL.examples[0]],
    },
    {
      lastUpdatedAt: '2026-01-02T00:00:00.000Z',
      beverages: [...HISTORICAL__BeverageV1Entry__ORIGINAL.examples],
    },
  ],
} as const;

/**
 * A list of all historical milestones for full BeverageV1 payloads.
 * Usually there'll only be one, which we never need to change.
 */
const ALL_HISTORICAL__BeverageV1PayloadMilestones = [
  HISTORICAL__BeverageV1Payload__ORIGINAL,
] as const;

///////////////////////////////////////////////////////////////////////////////////////////////////
// Rearrange for export
// The "ALL_HISTORICAL__" values above work better for recording milestones, but for reading/processing/testing
// it's easier when types and examples are separated.

type ALL_HISTORICAL__BeverageV1FetchParamTypes =
  (typeof ALL_HISTORICAL__BeverageV1FetchParamMilestones)[number]['type'];
type ALL_HISTORICAL__BeverageV1EntryTypes =
  (typeof ALL_HISTORICAL__BeverageV1EntryMilestones)[number]['type'];
type ALL_HISTORICAL__BeverageV1PayloadTypes =
  (typeof ALL_HISTORICAL__BeverageV1PayloadMilestones)[number]['type'];

// We use a spread to preserve the "as const" types from the examples (iterating over the array loses them).
// When adding a new milestone above, you MUST add the new index here.
// (Tests double-check that nothing was omitted)
const ALL_HISTORICAL__BeverageV1FetchParamExamples = [
  ...ALL_HISTORICAL__BeverageV1FetchParamMilestones[0].examples,
] as const;
const ALL_HISTORICAL__BeverageV1EntryExamples = [
  ...ALL_HISTORICAL__BeverageV1EntryMilestones[0].examples,
] as const;
const ALL_HISTORICAL__BeverageV1PayloadExamples = [
  ...ALL_HISTORICAL__BeverageV1PayloadMilestones[0].examples,
] as const;

/*
 * DO NOT IMPORT THESE EXCEPT FOR TESTING!
 * See the note at the top of this file for more.
 */
export {
  type ALL_HISTORICAL__BeverageV1FetchParamTypes,
  type ALL_HISTORICAL__BeverageV1EntryTypes,
  type ALL_HISTORICAL__BeverageV1PayloadTypes,
  ALL_HISTORICAL__BeverageV1FetchParamMilestones,
  ALL_HISTORICAL__BeverageV1EntryMilestones,
  ALL_HISTORICAL__BeverageV1PayloadMilestones,
  ALL_HISTORICAL__BeverageV1FetchParamExamples,
  ALL_HISTORICAL__BeverageV1EntryExamples,
  ALL_HISTORICAL__BeverageV1PayloadExamples,
};

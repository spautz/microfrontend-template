/*
 * "Entry points" are the actual remote .js files that the microfrontend provides.
 * Each entry point is a chunk within its build, and each exposes one or more functions.
 *
 * In general separate entry points are only needed if you need to *split the build*, to keep
 * the build size down by only loading the code/values you need for a given scope.
 * If you're just adding new functionality then add or update a contract instead.
 *
 * Side note:
 *    It's technically possible for a microfrontend to expose several 'partial' entry points --
 *    a "utils" and a "components", for example -- but that turns out to be more complicated than
 *    it's worth. Instead, in general EACH entry point should expose ALL of the functionality available.
 *   (I.e., have your "main" entry point export both "utils" and "components", so that you can just
 *    load "main", without mapping and tracking individual functions back to individual entry points.)
 *
 * An entry point must NEVER be removed once it's been added, except in a new major version.
 */

/**
 * Part of the module federation setup. This file contains and provides access to all
 * entry points exposed by the microfrontend app.
 */
const REMOTE_MODULE_CONTAINER_FILENAME = 'remoteEntry-mfeheader.js';

/**
 * An entry point that's being built in the microfrontend. These can be accessed in local dev only.
 */
const STATUS_IN_DEVELOPMENT = 1;
/**
 * An entry point that's been published to consumers, in both the microfrontend and the SDK.
 */
const STATUS_PUBLISHED = 2;
/**
 * A previously-published entry point that we'd like to get rid of -- except you must NEVER remove
 * identifiers. So this just marks them for removal in v2.
 */
// @TODO: Uncomment once we need this.
// const STATUS_REMOVE_IN_NEXT_MAJOR_VERSION = 3;

/**
 * The remote entry points (for module federation) exposed by the microfrontend.
 * These should generally align with the v1FetchParams (either directly, or by having the
 * v1FetchParams map options to these values.)
 *
 * When adding an item here, also add it to HISTORICAL_V1_FETCH_PARAMS.
 *
 * NEVER REMOVE AN ITEM FROM THIS LIST ONCE IT'S BEEN PUBLISHED! It's okay to stop accessing
 * a no-longer-needed entry point, but it must remain because old SDK versions may ask for it.
 */
const ALL_POTENTIAL_V1_ENTRY_POINTS = {
  'de-DE': STATUS_PUBLISHED,
  'en-GB': STATUS_PUBLISHED,
  'en-US': STATUS_PUBLISHED,
  'es-ES': STATUS_PUBLISHED,
  'fr-FR': STATUS_IN_DEVELOPMENT,
} as const;

type V1PotentialEntryPointIdentifier = keyof typeof ALL_POTENTIAL_V1_ENTRY_POINTS;
type V1PublishedEntryPointIdentifier = {
  [K in V1PotentialEntryPointIdentifier]: (typeof ALL_POTENTIAL_V1_ENTRY_POINTS)[K] extends typeof STATUS_PUBLISHED
    ? K
    : never;
}[V1PotentialEntryPointIdentifier];

const ENTRY_POINTS_FOR_V1_MICROFRONTEND = Object.keys(
  ALL_POTENTIAL_V1_ENTRY_POINTS,
) as V1PotentialEntryPointIdentifier[];

const ENTRY_POINTS_FOR_V1_SDK = ENTRY_POINTS_FOR_V1_MICROFRONTEND.filter(
  (identifier): identifier is V1PublishedEntryPointIdentifier =>
    ALL_POTENTIAL_V1_ENTRY_POINTS[identifier] === STATUS_PUBLISHED,
);

/**
 * Naming scheme for present and future entry points
 */
const entryPointValidationRegex = /^[a-z]{2}-[A-Z]{2}$/;

export {
  REMOTE_MODULE_CONTAINER_FILENAME,
  ENTRY_POINTS_FOR_V1_MICROFRONTEND,
  ENTRY_POINTS_FOR_V1_SDK,
  entryPointValidationRegex,
};

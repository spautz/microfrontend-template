import z from 'zod/v4';
import { ENTRY_POINTS_FOR_V1_SDK, entryPointValidationRegex } from './v1EntryPoints.ts';

/**
 * Fetch-params are the arguments that a consumer must pass when loading the microfrontend:
 * they map directly to an entry point, which is where we get all functionality.
 *
 * For V1 of this microfrontend: A locale may be provided, but it's not required.
 */
interface V1FetchParams {
  locale?: V1ExplicitlyKnownLocale | null | undefined;
}

/**
 * Build-time type checks use the *explicit* list of locales, to give good type hints and to catch
 * any places where host app typings don't line up.
 */
type V1ExplicitlyKnownLocale = (typeof ENTRY_POINTS_FOR_V1_SDK)[number] | null;
/**
 * Runtime checks use a *potential* value for locales, for forward-compatibility.
 */
type V1PotentialLocale = string | null | undefined;

const V1_SUPPORTED_LOCALES = [
  // All entry points are supported as locale names, or null to get the default.
  // (The locale maps directly to entry the point, via `convertV1FetchParamsToEntryPoint`)
  ...ENTRY_POINTS_FOR_V1_SDK,
  null,
] as const satisfies ReadonlyArray<V1ExplicitlyKnownLocale>;

const V1_DEFAULT_LOCALE: (typeof ENTRY_POINTS_FOR_V1_SDK)[number] = 'en-US';

/**
 * To accommodate future unknown locales, we allow any valid-looking locale -- even if it's not
 * in the above list.
 */
const v1FetchParamsSchema = z.strictObject({
  locale: z.string().regex(entryPointValidationRegex, 'Invalid locale code').nullable().optional(),
});

/**
 * A list of current fetch param examples, used for testing.
 */
const v1FetchParamsExamples = [
  {},
  ...V1_SUPPORTED_LOCALES.map((localeString) => ({
    locale: localeString,
  })),
] as const satisfies ReadonlyArray<V1FetchParams>;

///////////////////////////////////////////////////////////////////////////////////////////////////
// Utils

/**
 * Indicates whether the provided value is one of the locales in our explicit list.
 * This is dangerous because the list might be out-of-date: for most cases you'll want
 * `isPotentialV1Locale()` instead
 */
const isExplicitlyKnownV1Locale = (
  localeString: unknown,
): localeString is V1ExplicitlyKnownLocale => {
  // biome-ignore lint/suspicious/noExplicitAny: Validating type
  return V1_SUPPORTED_LOCALES.includes(localeString as any);
};

/**
 * Indicates whether the provided value is *likely* a valid locale.
 * This is more future-proof than `isExplicitlyKnownV1Locale()`
 */
const isPotentialV1Locale = (localeString: unknown): localeString is V1PotentialLocale => {
  if (localeString == null) {
    return true;
  }
  return typeof localeString === 'string' && entryPointValidationRegex.test(localeString);
};

/**
 * Canonical way to build the path for a V1 microfrontend's entry file.
 * The SDK package and the microfrontend app should use this to generate URLs and filenames.
 */
const convertV1FetchParamsToEntryPoint = (
  fetchParams: V1FetchParams,
  skipValidation?: boolean,
): (typeof ENTRY_POINTS_FOR_V1_SDK)[number] => {
  if (!skipValidation) {
    const validation = v1FetchParamsSchema.safeParse(fetchParams);
    if (validation.error) {
      throw new Error(`Invalid fetchParams for header microfrontend: ${validation.error}`);
    }
  }
  return fetchParams.locale || V1_DEFAULT_LOCALE;
};

export type { V1FetchParams };
export {
  V1_DEFAULT_LOCALE,
  v1FetchParamsSchema,
  v1FetchParamsExamples,
  isExplicitlyKnownV1Locale,
  isPotentialV1Locale,
  convertV1FetchParamsToEntryPoint,
};

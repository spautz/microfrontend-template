import z from 'zod/v4';
import { ENTRY_POINTS_FOR_V1_SDK, entryPointValidationRegex } from './v1EntryPoints.ts';

/**
 * Fetch-params are the arguments that a consumer must pass when loading the microfrontend:
 * they map directly to an entry point, which is where we get all functionality.
 *
 * For V1 of this microfrontend: A locale may be provided, but it's not required.
 */
interface V1FetchParams {
  locale?: (typeof V1_SUPPORTED_LOCALES)[number];
}

const V1_SUPPORTED_LOCALES = [
  // All entry points are supported as locale names, or null to get the default.
  // (Locale maps directly to entry point. `convertV1FetchParamsToEntryPoint` handles that.)
  ...ENTRY_POINTS_FOR_V1_SDK,
  null,
] as const;

const V1_DEFAULT_LOCALE: V1FetchParams['locale'] = 'en-US';

/**
 * To accommodate future unknown locales, we allow any valid-looking locale -- even if it's not
 * in the above list.
 */
const v1FetchParamsSchema = z.strictObject({
  locale: z
    .union([
      z.null(),
      z.undefined(),
      z.string().regex(entryPointValidationRegex, 'Invalid locale code'),
    ])
    .optional(),
});

/**
 * A list of current fetch param examples, used for testing.
 */
const v1FetchParamsExamples: Array<V1FetchParams> = [
  {},
  ...V1_SUPPORTED_LOCALES.map((localeString) => ({
    locale: localeString,
  })),
] as const;

///////////////////////////////////////////////////////////////////////////////////////////////////
// Utils

/**
 * Indicates whether the provided value is one of the locales in our explicit list.
 * This is dangerous because the list might be out-of-date: for most cases you'll want
 * `isPotentialV1Locale()` instead
 */
const isExactV1Locale = (localeString: unknown): localeString is V1FetchParams => {
  // biome-ignore lint/suspicious/noExplicitAny: Validating type
  return V1_SUPPORTED_LOCALES.includes(localeString as any);
};

/**
 * Indicates whether the provided value is *likely* a valid locale.
 * This is more future-proof than `isExactV1Locale()`
 */
const isPotentialV1Locale = (localeString: unknown): localeString is V1FetchParams => {
  return !localeString || entryPointValidationRegex.test(localeString as string);
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
      console.error('Invalid fetchParams for header microfrontend: ', fetchParams, validation);
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
  isExactV1Locale,
  isPotentialV1Locale,
  convertV1FetchParamsToEntryPoint,
};

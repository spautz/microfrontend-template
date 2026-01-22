import z from 'zod/v4';

/*
 * Fetch-params track the arguments that a consumer must pass when loading the HeaderV1 microfrontend:
 * A locale may be provided, but it's not required.
 */

const HEADER_V1_SUPPORTED_LOCALES = [
  undefined,
  null,
  'de-DE',
  'en-GB',
  'en-US',
  'es-ES',
  'fr-FR',
] as const;

const HEADER_V1_DEFAULT_LOCALE: HeaderV1FetchParams['locale'] = 'en-US';

type HeaderV1FetchParams = {
  locale?: (typeof HEADER_V1_SUPPORTED_LOCALES)[number];
};

/**
 * To accommodate future unknown locales, we allow any valid-looking locale -- even if it's not in the above list.
 */
const headerV1FetchParamSchema = z.strictObject({
  locale: z
    .union([
      z.null(),
      z.undefined(),
      z.string().regex(/^[a-z]{2}-[A-Z]{2}$/, 'Invalid locale code'),
    ])
    .optional(),
});

/**
 * A list of current fetch param examples, used for testing.
 */
const headerV1FetchParamExamples: Array<HeaderV1FetchParams> = [
  {},
  ...HEADER_V1_SUPPORTED_LOCALES.map((localeString) => ({
    locale: localeString,
  })),
] as const;

//////////////////////////////////////////////////////////////////////////////
// Utils

/**
 * Indicates whether the provided value is one of the locales in our explicit list.
 * This is dangerous because the list might be out-of-date: for most cases you might want
 * `isPotentiallyValidHeaderV1Locale()` instead
 */
const isExactHeaderV1Locale = (localeString: unknown): localeString is HeaderV1FetchParams => {
  // biome-ignore lint/suspicious/noExplicitAny: Validating type
  return HEADER_V1_SUPPORTED_LOCALES.includes(localeString as any);
};

/**
 * Indicates whether the provided value is *likely* a valid locale.
 * This is more future-proof than `isExactHeaderV1Locale()`
 */
const isPotentiallyValidHeaderV1Locale = (
  localeString: unknown,
): localeString is HeaderV1FetchParams => {
  return !localeString || /^[a-z]{2}-[A-Z]{2}$/.test(localeString as string);
};

/**
 * Canonical way to build the path for a HeaderV1 microfrontend's entry file.
 * The SDK package and the microfrontend app should use this to generate URLs and filenames.
 */
const convertHeaderV1FetchParamsToURLPath = (fetchParams: HeaderV1FetchParams): string => {
  const validation = headerV1FetchParamSchema.safeParse(fetchParams);
  if (validation.error) {
    console.error('Invalid fetchParams for Header config: ', fetchParams, validation);
    throw new Error(`Invalid fetchParams for Header config: ${validation.error}`);
  }
  const { locale } = fetchParams;

  return `v1/header/${locale || HEADER_V1_DEFAULT_LOCALE}.js`;
};

export type { HeaderV1FetchParams };
export {
  HEADER_V1_SUPPORTED_LOCALES,
  HEADER_V1_DEFAULT_LOCALE,
  headerV1FetchParamSchema,
  headerV1FetchParamExamples,
  isExactHeaderV1Locale,
  isPotentiallyValidHeaderV1Locale,
  convertHeaderV1FetchParamsToURLPath,
};

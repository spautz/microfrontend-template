import z from 'zod/v4';

/*
 * "Beverages" is just a made-up reference type.
 * https://stevenpautz.com/en/blog/2025/beverages/
 */

/**
 * Fetch-params track the arguments that a consumer must pass when loading a beverageV1 payload.
 * In this case, there's just one file with beverage info: no params required.
 */
const beverageV1FetchParamSchema = z.union([z.literal(undefined), z.strictObject({})]);

type BeverageV1FetchParams = undefined | Record<never, never>;

/**
 * A list of current fetch param examples, used for testing.
 */
const beverageV1FetchParamExamples: Array<BeverageV1FetchParams> = [undefined, {}] as const;

/**
 * Canonical way to build the path to a particular config file.
 *
 * This SHOULD be used by the SDK to generate the full URL when fetching.
 * This MAY be used by the Values package to generate the CONFIG_FILE keys for filenames.
 */
const convertBeverageV1FetchParamsToURLPath = (fetchParams?: BeverageV1FetchParams): string => {
  const validation = beverageV1FetchParamSchema.safeParse(fetchParams);
  if (validation.error) {
    console.error('Invalid fetchParams for Beverage config: ', fetchParams, validation);
    throw new Error(`Invalid fetchParams for Beverage config: ${validation.error}`);
  }

  return 'v1/beverages.json';
};

export type { BeverageV1FetchParams };
export {
  beverageV1FetchParamSchema,
  beverageV1FetchParamExamples,
  convertBeverageV1FetchParamsToURLPath,
};

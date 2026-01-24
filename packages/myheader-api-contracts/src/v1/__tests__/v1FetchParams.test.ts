import { describe, expect, test } from 'vitest';
import { ENTRY_POINTS_FOR_V1_MICROFRONTEND, ENTRY_POINTS_FOR_V1_SDK } from '../v1EntryPoints.ts';
import {
  isExactV1Locale,
  isPotentialV1Locale,
  type V1FetchParams,
  v1FetchParamExamples,
  v1FetchParamSchema,
} from '../v1FetchParams.ts';

// The current examples must match the current typings
v1FetchParamExamples satisfies Array<V1FetchParams>;

// Finally, validate all examples against the schema
describe('V1 FetchParams', () => {
  test.each(
    v1FetchParamExamples,
  )('Examples all pass current schema (#%#)', (exampleFetchParams) => {
    const result = v1FetchParamSchema.safeParse(exampleFetchParams);
    expect(result.error).toBeFalsy();
  });

  test('All entry points should look like potential locales', () => {
    for (const identifier of ENTRY_POINTS_FOR_V1_MICROFRONTEND) {
      expect(isPotentialV1Locale(identifier)).toBe(true);
    }
  });

  test('All SDK points should be recognized as exact locales', () => {
    for (const identifier of ENTRY_POINTS_FOR_V1_SDK) {
      expect(isExactV1Locale(identifier)).toBe(true);
    }
  });
});

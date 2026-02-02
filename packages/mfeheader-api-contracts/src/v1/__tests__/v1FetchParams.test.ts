import { describe, expect, test } from 'vitest';
import { ENTRY_POINTS_FOR_V1_MICROFRONTEND, ENTRY_POINTS_FOR_V1_SDK } from '../v1EntryPoints.ts';
import {
  convertV1FetchParamsToEntryPoint,
  isExplicitlyKnownV1Locale,
  isPotentialV1Locale,
  type V1FetchParams,
  v1FetchParamsExamples,
  v1FetchParamsSchema,
} from '../v1FetchParams.ts';

// The current examples must match the current typings
v1FetchParamsExamples satisfies ReadonlyArray<V1FetchParams>;

// Finally, validate all examples against the schema
describe('V1 FetchParams', () => {
  test.each(v1FetchParamsExamples)('Examples all pass current schema (#%#)', (example) => {
    const result = v1FetchParamsSchema.safeParse(example);
    expect(result.error).toBeFalsy();
  });

  test('All entry points should look like potential locales', () => {
    for (const identifier of ENTRY_POINTS_FOR_V1_MICROFRONTEND) {
      expect(isPotentialV1Locale(identifier)).toBe(true);
    }
  });

  test('All SDK points should be recognized as exact locales', () => {
    for (const identifier of ENTRY_POINTS_FOR_V1_SDK) {
      expect(isExplicitlyKnownV1Locale(identifier)).toBe(true);
    }
  });

  test('Potential locales allow valid-looking future values', () => {
    expect(isPotentialV1Locale('pt-BR')).toBe(true);
    expect(isExplicitlyKnownV1Locale('pt-BR')).toBe(false);
  });

  test('Potential locales reject invalid values', () => {
    expect(isPotentialV1Locale('')).toBe(false);
    expect(isPotentialV1Locale('en-us')).toBe(false);
    expect(isPotentialV1Locale(123)).toBe(false);
  });

  test('Fetch param conversion defaults the locale', () => {
    expect(convertV1FetchParamsToEntryPoint({})).toBe('en-US');
  });

  test('Fetch param conversion preserves supported locales', () => {
    expect(convertV1FetchParamsToEntryPoint({ locale: 'en-GB' })).toBe('en-GB');
  });

  test('Fetch param conversion rejects invalid locales by default', () => {
    expect(() =>
      convertV1FetchParamsToEntryPoint({ locale: 'en-us' as V1FetchParams['locale'] }),
    ).toThrow();
  });
});

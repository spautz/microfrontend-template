import { describe, expect, test } from 'vitest';

import { ENTRY_POINTS_FOR_V1_MICROFRONTEND, ENTRY_POINTS_FOR_V1_SDK } from '../v1EntryPoints.ts';

describe('v1EntryPoints', () => {
  test('All SDK-exposed entry points should be supported by the microfrontend', () => {
    for (const identifier of ENTRY_POINTS_FOR_V1_SDK) {
      expect(ENTRY_POINTS_FOR_V1_MICROFRONTEND.includes(identifier)).toBe(true);
    }
  });
});

import { describe, expect, test } from 'vitest';

import { ENTRY_POINTS_FOR_V1_MICROFRONTEND, ENTRY_POINTS_FOR_V1_SDK } from '../v1EntryPoints.ts';

describe('v1EntryPoints', () => {
  test.each(
    ENTRY_POINTS_FOR_V1_SDK,
  )('SDK entry point is supported by the microfrontend (%s)', (identifier) => {
    expect(ENTRY_POINTS_FOR_V1_MICROFRONTEND.includes(identifier)).toBe(true);
  });
});

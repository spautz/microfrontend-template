import { describe, expect, test } from 'vitest';

import { buildFullUrl, buildUrlOrPath } from '../urlUtils.ts';

describe('buildUrlOrPath', () => {
  test('adds a slash when neither side has one', () => {
    expect(buildUrlOrPath('https://example.com', 'child')).toBe('https://example.com/child');
  });

  test('avoids double slashes when both sides have one', () => {
    expect(buildUrlOrPath('https://example.com/', '/child')).toBe('https://example.com/child');
  });

  test('joins base paths that start with a slash', () => {
    expect(buildUrlOrPath('/api', 'v1')).toBe('/api/v1');
  });

  test('joins base paths that already have a trailing slash', () => {
    expect(buildUrlOrPath('/api/', '/v1')).toBe('/api/v1');
  });
});

describe('buildFullUrl', () => {
  test('accepts a URL object', () => {
    expect(buildFullUrl(new URL('https://example.com/base'), 'child')).toBe(
      'https://example.com/base/child',
    );
  });

  test('joins when both sides include slashes', () => {
    expect(buildFullUrl('https://example.com/base/', '/child')).toBe(
      'https://example.com/base/child',
    );
  });
});

import { afterEach, describe, expect, it, vi } from 'vitest';
import { throwAndFailTest } from '../../__tests__/testUtils.ts';
import { getHeaderAssetsPrefetchHTML } from '../getHeaderAssetsPrefetchHTML.ts';

describe('getHeaderAssetsPrefetchHTML', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches the assets prefetch HTML for the locale', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue('<link rel="prefetch" href="/app.js">'),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await getHeaderAssetsPrefetchHTML({
      baseUrl: new URL('https://example.com/'),
      onInitializationError: throwAndFailTest,
      onUncaughtRuntimeError: throwAndFailTest,
      locale: 'en-US',
    });

    expect(fetchMock).toHaveBeenCalledWith('https://example.com/asset-include/en-US-prefetch.html');
    expect(result).toBe('<link rel="prefetch" href="/app.js">');
  });

  it('reports an error and returns null when the request fails', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: vi.fn(),
    });
    vi.stubGlobal('fetch', fetchMock);
    const onInitializationError = vi.fn();

    const result = await getHeaderAssetsPrefetchHTML({
      baseUrl: new URL('https://example.com/'),
      onInitializationError,
      onUncaughtRuntimeError: throwAndFailTest,
      locale: 'en-US',
    });

    expect(result).toBe(null);
    expect(onInitializationError).toHaveBeenCalled();
  });
});

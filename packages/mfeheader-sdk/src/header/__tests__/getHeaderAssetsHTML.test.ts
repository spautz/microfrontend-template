import { afterEach, describe, expect, it, vi } from 'vitest';
import { throwAndFailTest } from '../../__tests__/testUtils.ts';
import { getHeaderAssetsHTML } from '../getHeaderAssetsHTML.ts';

describe('getHeaderAssetsHTML', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches the assets head HTML for the locale', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue('<link rel="stylesheet" href="/styles.css">'),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await getHeaderAssetsHTML({
      baseUrl: new URL('https://example.com/'),
      onInitializationError: throwAndFailTest,
      onUncaughtRuntimeError: throwAndFailTest,
      locale: 'en-US',
    });

    expect(fetchMock).toHaveBeenCalledWith('https://example.com/asset-include/en-US-head.html');
    expect(result).toBe('<link rel="stylesheet" href="/styles.css">');
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

    const result = await getHeaderAssetsHTML({
      baseUrl: new URL('https://example.com/'),
      onInitializationError,
      onUncaughtRuntimeError: throwAndFailTest,
      locale: 'en-US',
    });

    expect(result).toBe(null);
    expect(onInitializationError).toHaveBeenCalled();
  });
});

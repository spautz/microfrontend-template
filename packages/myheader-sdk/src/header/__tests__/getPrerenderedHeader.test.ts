import { afterEach, describe, expect, it, vi } from 'vitest';
import { throwAndFailTest } from '../../__tests__/testUtils.ts';
import { getPrerenderedHeader } from '../getPrerenderedHeader.ts';

describe('getPrerenderedHeader', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches prerendered HTML for the locale', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue('<div>header</div>'),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await getPrerenderedHeader({
      baseUrl: new URL('https://example.com/'),
      onInitializationError: throwAndFailTest,
      onUncaughtRuntimeError: throwAndFailTest,
      locale: 'en-US',
      initialUrlPath: null,
    });

    expect(fetchMock).toHaveBeenCalledWith('https://example.com/prerenders/en-US.html');
    expect(result).toBe('<div>header</div>');
  });

  it('adds initialUrlPath to the request when provided', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue('<div>header</div>'),
    });
    vi.stubGlobal('fetch', fetchMock);

    await getPrerenderedHeader({
      baseUrl: new URL('https://example.com/mfe/'),
      onInitializationError: throwAndFailTest,
      onUncaughtRuntimeError: throwAndFailTest,
      locale: 'en-GB',
      initialUrlPath: '/drinks',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com/mfe/prerenders/en-GB.html?initialUrlPath=%2Fdrinks',
    );
  });

  it('returns an error and reports it when the request fails', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: vi.fn(),
    });
    vi.stubGlobal('fetch', fetchMock);
    const onInitializationError = vi.fn();

    const result = await getPrerenderedHeader({
      baseUrl: new URL('https://example.com/'),
      onInitializationError,
      onUncaughtRuntimeError: throwAndFailTest,
      locale: 'en-US',
      initialUrlPath: null,
    });

    expect(result).toBeInstanceOf(Error);
    expect(onInitializationError).toHaveBeenCalled();
  });
});

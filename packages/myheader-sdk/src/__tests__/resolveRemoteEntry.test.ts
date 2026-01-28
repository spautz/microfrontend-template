import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadRemoteEntryContainer } from '../loadRemoteEntryContainer.ts';
import { resolveRemoteEntry } from '../resolveRemoteEntry.ts';
import { throwAndFailTest } from './testUtils.ts';

vi.mock('../loadRemoteEntryContainer.ts', () => ({
  loadRemoteEntryContainer: vi.fn(),
}));

describe('resolveRemoteEntry', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('loads the entry point for the locale', async () => {
    const baseUrl = new URL('https://example.com/');
    const v1Header_mount = vi.fn();
    const v1Header_rehydrate = vi.fn();
    const v1Header_prerender = vi.fn();
    const entryModule = { v1Header_mount, v1Header_rehydrate, v1Header_prerender };
    const factory = vi.fn().mockResolvedValue(entryModule);
    const container = { get: vi.fn().mockResolvedValue(factory) };

    vi.mocked(loadRemoteEntryContainer).mockResolvedValue(
      container as Awaited<ReturnType<typeof loadRemoteEntryContainer>>,
    );

    const result = await resolveRemoteEntry({
      baseUrl,
      onInitializationError: throwAndFailTest,
      onUncaughtRuntimeError: throwAndFailTest,
      locale: 'en-GB',
    });

    expect(loadRemoteEntryContainer).toHaveBeenCalledWith(baseUrl);
    expect(container.get).toHaveBeenCalledWith('./en-GB');
    expect(factory).toHaveBeenCalled();
    expect(result).toBe(entryModule);
  });

  it('does not halt on prefetch errors', async () => {
    const baseUrl = new URL('https://example.com/');
    const v1Header_mount = vi.fn();
    const v1Header_rehydrate = vi.fn();
    const v1Header_prerender = vi.fn();
    const entryModule = { v1Header_mount, v1Header_rehydrate, v1Header_prerender };
    const factory = vi.fn().mockResolvedValue(entryModule);
    const container = { get: vi.fn().mockResolvedValue(factory) };

    vi.mocked(loadRemoteEntryContainer).mockResolvedValue(
      container as Awaited<ReturnType<typeof loadRemoteEntryContainer>>,
    );

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await resolveRemoteEntry({
      baseUrl,
      onInitializationError: throwAndFailTest,
      onUncaughtRuntimeError: throwAndFailTest,
      locale: 'en-US',
    });

    expect(fetchMock).toHaveBeenCalledWith('https://example.com/asset-include/en-US.json');
    expect(loadRemoteEntryContainer).toHaveBeenCalledWith(baseUrl);
    expect(container.get).toHaveBeenCalledWith('./en-US');
    expect(factory).toHaveBeenCalled();
    expect(result).toBe(entryModule);
  });
});

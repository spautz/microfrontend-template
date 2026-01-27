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

  it('reports initialization errors and rethrows', async () => {
    const baseUrl = new URL('https://example.com/');
    const onInitializationError = vi.fn();
    const failure = new Error('boom');

    vi.mocked(loadRemoteEntryContainer).mockRejectedValue(failure);

    await expect(
      resolveRemoteEntry({
        baseUrl,
        onInitializationError,
        onUncaughtRuntimeError: throwAndFailTest,
        locale: 'en-US',
      }),
    ).rejects.toThrow('boom');

    expect(onInitializationError).toHaveBeenCalledWith('Could not resolve remote entry', failure);
  });
});

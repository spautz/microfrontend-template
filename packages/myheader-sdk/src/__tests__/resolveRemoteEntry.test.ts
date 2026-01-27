import { afterEach, describe, expect, it, vi } from 'vitest';
import * as remoteEntryModule from '../resolveRemoteEntry.ts';

const { resolveRemoteEntry } = remoteEntryModule;

describe('resolveRemoteEntry', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads the entry point for the locale', async () => {
    const baseUrl = new URL('https://example.com/');
    const onInitializationError = vi.fn();
    const v1Header_mount = vi.fn();
    const entryModule = { v1Header_mount };
    const factory = vi.fn().mockResolvedValue(entryModule);
    const container = { get: vi.fn().mockResolvedValue(factory) };

    const loadRemoteEntry = vi
      .fn()
      .mockResolvedValue(
        container as Awaited<ReturnType<typeof remoteEntryModule.loadRemoteEntryContainer>>,
      );

    const result = await resolveRemoteEntry(
      {
        baseUrl,
        onInitializationError,
        locale: 'en-GB',
      },
      loadRemoteEntry,
    );

    expect(loadRemoteEntry).toHaveBeenCalledWith(baseUrl);
    expect(container.get).toHaveBeenCalledWith('./en-GB');
    expect(factory).toHaveBeenCalled();
    expect(result).toBe(entryModule);
  });

  it('reports initialization errors and rethrows', async () => {
    const baseUrl = new URL('https://example.com/');
    const onInitializationError = vi.fn();
    const failure = new Error('boom');

    const loadRemoteEntry = vi.fn().mockRejectedValue(failure);

    await expect(
      resolveRemoteEntry(
        {
          baseUrl,
          onInitializationError,
          locale: 'en-US',
        },
        loadRemoteEntry,
      ),
    ).rejects.toThrow('boom');

    expect(onInitializationError).toHaveBeenCalledWith('Could not resolve remote entry', failure);
  });
});

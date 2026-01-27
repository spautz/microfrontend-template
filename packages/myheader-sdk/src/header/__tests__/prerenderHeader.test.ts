import { afterEach, describe, expect, it, vi } from 'vitest';
import { throwAndFailTest } from '../../__tests__/testUtils.ts';
import { resolveRemoteEntry } from '../../resolveRemoteEntry.ts';
import { prerenderHeader } from '../prerenderHeader.ts';

vi.mock('../../resolveRemoteEntry.ts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../resolveRemoteEntry.ts')>();
  return {
    ...actual,
    resolveRemoteEntry: vi.fn(),
  };
});

describe('prerenderHeader', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('resolves the remote entry using baseUrl and locale', async () => {
    const baseUrl = new URL('https://example.com/');
    const v1Header_prerender = vi
      .fn()
      .mockReturnValue({ setNewOptions: vi.fn(), unprerender: vi.fn() });

    vi.mocked(resolveRemoteEntry).mockResolvedValue({
      v1Header_mount: vi.fn(),
      v1Header_rehydrate: vi.fn(),
      v1Header_prerender,
    });

    await prerenderHeader({
      baseUrl,
      onInitializationError: throwAndFailTest,
      onUncaughtRuntimeError: throwAndFailTest,
      locale: 'en-US',
      initialUrlPath: null,
    });

    expect(resolveRemoteEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        baseUrl,
        locale: 'en-US',
        onInitializationError: throwAndFailTest,
      }),
    );
    expect(v1Header_prerender).toHaveBeenCalledWith(
      expect.objectContaining({
        initialUrlPath: null,
      }),
    );
  });

  it('passes through render options and returns the update callback', async () => {
    const baseUrl = new URL('https://example.com/');
    const setNewOptions = vi.fn();
    const unprerender = vi.fn();
    const prerenderResult = { setNewOptions, unprerender };
    const v1Header_prerender = vi.fn().mockReturnValue(prerenderResult);

    vi.mocked(resolveRemoteEntry).mockResolvedValue({
      v1Header_mount: vi.fn(),
      v1Header_rehydrate: vi.fn(),
      v1Header_prerender,
    });

    const result = await prerenderHeader({
      baseUrl,
      onInitializationError: throwAndFailTest,
      onUncaughtRuntimeError: throwAndFailTest,
      locale: 'en-GB',
      initialUrlPath: '/drinks',
    });

    expect(v1Header_prerender).toHaveBeenCalledWith({
      initialUrlPath: '/drinks',
    });
    expect(result).toBe(prerenderResult);
  });
});

import { afterEach, describe, expect, it, vi } from 'vitest';
import { throwAndFailTest } from '../../__tests__/testUtils.ts';
import { resolveRemoteEntry } from '../../resolveRemoteEntry.ts';
import { rehydrateHeader } from '../rehydrateHeader.ts';

vi.mock('../../resolveRemoteEntry.ts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../resolveRemoteEntry.ts')>();
  return {
    ...actual,
    resolveRemoteEntry: vi.fn(),
  };
});

describe('rehydrateHeader', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('resolves the remote entry using baseUrl and locale', async () => {
    const baseUrl = new URL('https://example.com/');
    const rootElement = document.createElement('div');
    const v1Header_rehydrate = vi
      .fn()
      .mockReturnValue({ setNewOptions: vi.fn(), unrehydrate: vi.fn() });

    vi.mocked(resolveRemoteEntry).mockResolvedValue({
      v1Header_mount: vi.fn(),
      v1Header_prerender: vi.fn(),
      v1Header_rehydrate,
    });

    await rehydrateHeader({
      baseUrl,
      onInitializationError: throwAndFailTest,
      locale: 'en-US',
      rootElement,
      initialUrlPath: null,
    });

    expect(resolveRemoteEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        baseUrl,
        locale: 'en-US',
        onInitializationError: throwAndFailTest,
      }),
    );
    expect(v1Header_rehydrate).toHaveBeenCalledWith(
      expect.objectContaining({
        rootElement,
        initialUrlPath: null,
      }),
    );
  });

  it('passes through render options and returns the update callback', async () => {
    const baseUrl = new URL('https://example.com/');
    const rootElement = document.createElement('div');
    const onNavLinkClick = vi.fn();
    const setNewOptions = vi.fn();
    const unrehydrate = vi.fn();
    const rehydrateResult = { setNewOptions, unrehydrate };
    const v1Header_rehydrate = vi.fn().mockReturnValue(rehydrateResult);

    vi.mocked(resolveRemoteEntry).mockResolvedValue({
      v1Header_mount: vi.fn(),
      v1Header_prerender: vi.fn(),
      v1Header_rehydrate,
    });

    const result = await rehydrateHeader({
      baseUrl,
      onInitializationError: throwAndFailTest,
      locale: 'en-GB',
      rootElement,
      initialUrlPath: '/drinks',
      onNavLinkClick,
    });

    expect(v1Header_rehydrate).toHaveBeenCalledWith({
      rootElement,
      initialUrlPath: '/drinks',
      onNavLinkClick,
    });
    expect(result).toBe(rehydrateResult);
  });
});

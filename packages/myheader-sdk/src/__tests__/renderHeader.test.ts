import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderHeader } from '../renderHeader.js';
import { resolveRemoteEntry } from '../resolveRemoteEntry.js';

vi.mock('../resolveRemoteEntry.js', () => ({
  resolveRemoteEntry: vi.fn(),
}));

describe('renderHeader', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('resolves the remote entry using baseUrl and locale', async () => {
    const baseUrl = new URL('https://example.com/');
    const rootElement = document.createElement('div');
    const v1Render = vi.fn().mockReturnValue(() => {});

    vi.mocked(resolveRemoteEntry).mockResolvedValue({ v1Render });

    await renderHeader({ baseUrl, locale: 'en-US', rootElement });

    expect(resolveRemoteEntry).toHaveBeenCalledWith(baseUrl, { locale: 'en-US' });
    expect(v1Render).toHaveBeenCalledWith(
      expect.objectContaining({
        rootElement,
        initialUrlPath: '',
      }),
    );
  });

  it('passes through render options and returns the update callback', async () => {
    const baseUrl = new URL('https://example.com/');
    const rootElement = document.createElement('div');
    const onNavLinkClick = vi.fn();
    const updateCallback = vi.fn();
    const v1Render = vi.fn().mockReturnValue(updateCallback);

    vi.mocked(resolveRemoteEntry).mockResolvedValue({ v1Render });

    const result = await renderHeader({
      baseUrl,
      locale: 'en-GB',
      rootElement,
      initialUrlPath: '/drinks',
      onNavLinkClick,
    });

    expect(v1Render).toHaveBeenCalledWith({
      rootElement,
      initialUrlPath: '/drinks',
      onNavLinkClick,
    });
    expect(result).toBe(updateCallback);
  });
});

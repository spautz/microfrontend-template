import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

import { resolveRemoteEntry } from '../resolveRemoteEntry.js';

const clearTestGlobals = () => {
  delete (globalThis as { __mf_test_entryPoint?: string }).__mf_test_entryPoint;
  delete (globalThis as { __mf_test_share_scope?: Record<string, unknown> }).__mf_test_share_scope;
  delete (globalThis as { __mf_test_render_called?: boolean }).__mf_test_render_called;
  delete (globalThis as { __federation_shared__?: Record<string, unknown> }).__federation_shared__;
};

describe('resolveRemoteEntry', () => {
  afterEach(() => {
    clearTestGlobals();
  });

  it('loads the remote entry module and resolves the entry point', async () => {
    const sharedScope = { react: { singleton: true } };
    (globalThis as { __federation_shared__?: Record<string, unknown> }).__federation_shared__ =
      sharedScope;

    const cwd = process.cwd();
    const fixturesRelativePath =
      path.basename(cwd) === 'myheader-sdk'
        ? 'src/__tests__/fixtures/'
        : 'packages/myheader-sdk/src/__tests__/fixtures/';
    const fixturesPath = path.resolve(cwd, fixturesRelativePath);
    const baseUrl = pathToFileURL(`${fixturesPath}${path.sep}`);
    const module = await resolveRemoteEntry(baseUrl, { locale: 'en-US' });

    expect((globalThis as { __mf_test_entryPoint?: string }).__mf_test_entryPoint).toBe('./en-US');
    expect(
      (globalThis as { __mf_test_share_scope?: Record<string, unknown> }).__mf_test_share_scope,
    ).toBe(sharedScope);
    expect(typeof module.v1Render).toBe('function');

    const updateCallback = module.v1Render({
      rootElement: document.createElement('div'),
      initialUrlPath: '/',
    });

    expect((globalThis as { __mf_test_render_called?: boolean }).__mf_test_render_called).toBe(
      true,
    );
    expect(typeof updateCallback).toBe('function');
  });
});

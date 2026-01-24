import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { ENTRY_POINTS_FOR_V1_MICROFRONTEND } from '@spautz/header-api-contracts';
import { createServer } from 'vite';

type V1Prerender = (options: { initialUrlPath: string }) => Promise<string> | string;
type PrerenderModule = { v1Prerender?: V1Prerender };

const root = process.cwd();
const outputDir = path.join(root, 'dist', 'prerender');

const server = await createServer({
  root,
  appType: 'custom',
  logLevel: 'warn',
  server: { middlewareMode: true },
  configFile: false,
});

try {
  await mkdir(outputDir, { recursive: true });

  for (const entryPoint of ENTRY_POINTS_FOR_V1_MICROFRONTEND) {
    const entryModule = (await server.ssrLoadModule(
      `/src/entryPoints/server/${entryPoint}.tsx`,
    )) as PrerenderModule;
    const { v1Prerender } = entryModule;

    if (typeof v1Prerender !== 'function') {
      throw new Error(`Missing v1Prerender export in entryPoints/server/${entryPoint}.tsx`);
    }

    const html = await v1Prerender({ initialUrlPath: '/' });
    await writeFile(path.join(outputDir, `${entryPoint}.html`), `${html}\n`, 'utf8');
  }
} finally {
  await server.close();
}

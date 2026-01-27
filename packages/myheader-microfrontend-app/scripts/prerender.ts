import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { ENTRY_POINTS_FOR_V1_MICROFRONTEND } from '@spautz/header-api-contracts/v1';
import { createServer } from 'vite';

type V1HeaderPrerender = (options: { initialUrlPath: string }) => Promise<string> | string;
type PrerenderModule = { v1Header_prerender?: V1HeaderPrerender };

const root = process.cwd();
const outputDir = path.join(root, 'dist', 'prerenders');

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
    const v1HeaderPrerender = entryModule.v1Header_prerender;

    if (typeof v1HeaderPrerender !== 'function') {
      throw new Error(`Missing v1Header_prerender export in entryPoints/server/${entryPoint}.tsx`);
    }

    const html = await v1HeaderPrerender({ initialUrlPath: '/' });
    await writeFile(path.join(outputDir, `${entryPoint}.html`), `${html}\n`, 'utf8');
  }
} finally {
  await server.close();
}

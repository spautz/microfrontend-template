import { dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import type { OptionsForGetPrerenderedHeader } from '../header/getPrerenderedHeader.ts';
import { getRemoteEntryPointIdentifier } from '../resolveRemoteEntry.ts';

const resolveLocalFallbackPrerenderUrl = (options: OptionsForGetPrerenderedHeader): URL => {
  const entryPoint = getRemoteEntryPointIdentifier(options);
  const serverIndexDir = dirname(fileURLToPath(import.meta.url));
  const resolvedPath = resolvePath(
    serverIndexDir,
    '../local-fallback/prerenders',
    `${entryPoint}.html`,
  );
  return pathToFileURL(resolvedPath);
};

export { resolveLocalFallbackPrerenderUrl };

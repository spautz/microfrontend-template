import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

const sourceDir = process.argv[2];
if (!sourceDir) {
  throw new Error(
    'Usage: node ./scripts/copy-local-fallback-from-microfrontend.ts <path-to-microfrontend-dist>',
  );
}

// Always run from (and keep all paths relative to) the SDK project
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const sdkProjectRoot = path.resolve(scriptDir, '..');

const destinationDir = path.resolve(sdkProjectRoot, 'dist/local-fallback');

// Create the destination directory anew
await fs.rm(destinationDir, { force: true, recursive: true });
await fs.mkdir(destinationDir, { recursive: true });

const filesToCopy = await glob('**/*', { cwd: sourceDir, nodir: true, dot: true });
if (!filesToCopy.length) {
  throw new Error(`Did not find any files to copy from ${sourceDir}`);
}

let numFilesCopied = 0;
for (const rel of filesToCopy) {
  const src = path.join(sourceDir, rel);
  const dst = path.join(destinationDir, rel);

  await fs.mkdir(path.dirname(dst), { recursive: true });
  await fs.copyFile(src, dst);
  numFilesCopied++;
}

process.stdout.write(`local-fallback sync: copied ${numFilesCopied} file(s)\n`);

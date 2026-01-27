import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, isAbsolute, relative, resolve, sep } from 'node:path';
import federation from '@originjs/vite-plugin-federation';
import {
  ENTRY_POINTS_FOR_V1_MICROFRONTEND,
  REMOTE_MODULE_CONTAINER_FILENAME,
} from '@spautz/header-api-contracts/v1';
import react from '@vitejs/plugin-react';
import { type Connect, defineConfig } from 'vite';

// Entry points must be prefixed with `./` for the federation plugin
const entryPoints = ENTRY_POINTS_FOR_V1_MICROFRONTEND.reduce<Record<string, string>>(
  (acc, identifier) => {
    acc[`./${identifier}`] = `./src/entryPoints/browser/${identifier}.tsx`;
    return acc;
  },
  {},
);

const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
  '.css': 'text/css',
  '.eot': 'application/vnd.ms-fontobject',
  '.gif': 'image/gif',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.map': 'application/json',
  '.mjs': 'application/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain',
  '.wasm': 'application/wasm',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
};

const getContentType = (filePath: string): string => {
  const extension = extname(filePath).toLowerCase();
  return CONTENT_TYPE_BY_EXTENSION[extension] ?? 'application/octet-stream';
};

const createDistMiddleware = (basePath: string, rootDir: string) => {
  const normalizedBasePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;

  return (
    req: Connect.IncomingMessage,
    res: Connect.ServerResponse,
    next: Connect.NextFunction,
  ) => {
    if (!req.url) {
      next();
      return;
    }

    const { pathname } = new URL(req.url, 'http://localhost');
    if (pathname !== normalizedBasePath && !pathname.startsWith(`${normalizedBasePath}/`)) {
      next();
      return;
    }

    const relativePath = pathname.slice(normalizedBasePath.length);
    if (!relativePath || relativePath === '/') {
      next();
      return;
    }

    const sanitizedPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
    const filePath = resolve(rootDir, sanitizedPath);
    const relativeToRoot = relative(rootDir, filePath);
    if (
      isAbsolute(relativeToRoot) ||
      relativeToRoot.startsWith('..') ||
      relativeToRoot.includes(`..${sep}`)
    ) {
      res.statusCode = 403;
      res.end('Forbidden');
      return;
    }

    void (async () => {
      try {
        const fileStat = await stat(filePath);
        if (!fileStat.isFile()) {
          next();
          return;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', getContentType(filePath));
        res.setHeader('Content-Length', fileStat.size.toString());
        res.setHeader('Cache-Control', 'no-cache');

        if (req.method === 'HEAD') {
          res.end();
          return;
        }

        const stream = createReadStream(filePath);
        stream.on('error', next);
        stream.pipe(res);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          next();
          return;
        }
        next(error as Error);
      }
    })();
  };
};

const distRoot = resolve(__dirname, 'dist');
const distAssetsRoot = resolve(distRoot, 'assets');
const distPrerendersRoot = resolve(distRoot, 'prerenders');

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    manifest: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        // Main entry point
        default: resolve(__dirname, 'index.html'),
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    federation({
      name: 'myheader-mfe',
      filename: REMOTE_MODULE_CONTAINER_FILENAME,
      exposes: entryPoints,
      shared: {
        react: { requiredVersion: '18' },
        'react-dom': { requiredVersion: '18' },
      },
    }),
    {
      name: 'serve-dist-artifacts',
      configureServer(server) {
        server.middlewares.use(createDistMiddleware('/assets', distAssetsRoot));
        server.middlewares.use(createDistMiddleware('/prerenders', distPrerendersRoot));
      },
    },
  ],
  server: {
    proxy: {
      // Remote data sources for local dev
    },
  },
});

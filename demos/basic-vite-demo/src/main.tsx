import { createRemoteEntryLoader, mountHeader } from '@spautz/header-sdk';
import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App.js';

const loadRemoteEntry = createRemoteEntryLoader(
  (remoteEntryUrl) => import(/* @vite-ignore */ /* webpackIgnore: true */ remoteEntryUrl),
);

mountHeader({
  // biome-ignore lint/suspicious/noConsole: Local dev doesn't need real reporting: the console is enough
  onInitializationError: console.error,
  // biome-ignore lint/suspicious/noConsole: Local dev doesn't need real reporting: the console is enough
  onUncaughtRuntimeError: console.error,
  baseUrl: new URL('/proxy-to-mfe/', window.location.origin),
  locale: 'en-US',
  loadRemoteEntry,
  // #header is created in index.html
  rootElement: document.getElementById('header') as HTMLElement,
  initialUrlPath: window.location.pathname,
});

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

import { mountHeader } from '@spautz/myheader-sdk';
import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App.js';

const headerBrowserBaseUrl = import.meta.env.VITE_HEADER_BROWSER_BASE_URL;

mountHeader({
  // biome-ignore lint/suspicious/noConsole: Local dev doesn't need real reporting: the console is enough
  onInitializationError: console.error,
  // biome-ignore lint/suspicious/noConsole: Local dev doesn't need real reporting: the console is enough
  onUncaughtRuntimeError: console.error,
  baseUrl: new URL(headerBrowserBaseUrl, window.location.origin),
  locale: 'en-US',
  // #header is created in index.html
  rootElement: document.getElementById('header') as HTMLElement,
  initialUrlPath: window.location.pathname,
});

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

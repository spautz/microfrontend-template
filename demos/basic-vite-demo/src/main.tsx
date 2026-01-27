import { mountHeader } from '@spautz/header-sdk';
import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App.js';

mountHeader({
  // biome-ignore lint/suspicious/noConsole: Local dev doesn't need real reporting: the console is enough
  onInitializationError: console.error,
  baseUrl: new URL('/proxy-to-mfe/', window.location.origin),
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

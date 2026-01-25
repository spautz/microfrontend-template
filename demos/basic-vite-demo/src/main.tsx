import { renderHeader } from '@spautz/header-sdk';
import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App.js';

renderHeader({
  baseUrl: new URL('/proxy-to-mfe/', window.location.origin),
  rootElement: document.getElementById('header') as HTMLElement,
  initialUrlPath: window.location.pathname,
});

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

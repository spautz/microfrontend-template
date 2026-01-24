import type { V1Render } from '@spautz/header-api-contracts';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { setUrlPath, UrlPathProvider } from '../UrlPathContext/UrlPathContext.js';
import { Header, type HeaderProps } from './Header/Header.js';

interface ValuesForV1Render {
  linkLabels: HeaderProps['linkLabels'];
}

const v1RenderWithEntryPointValues = (
  entryPointValues: ValuesForV1Render,
  options: Parameters<V1Render>[0],
): ReturnType<V1Render> => {
  const { rootElement, initialUrlPath } = options;
  const { linkLabels } = entryPointValues;

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <UrlPathProvider initialUrlPath={initialUrlPath}>
        <Header linkLabels={linkLabels} />
      </UrlPathProvider>
    </React.StrictMode>,
  );

  return (newOptions) => {
    const { newUrlPath } = newOptions;
    if (newUrlPath != null) {
      setUrlPath(newUrlPath);
    }
  };
};

export { v1RenderWithEntryPointValues };

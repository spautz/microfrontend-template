import type { V1Render } from '@spautz/header-api-contracts';
import ReactDOM from 'react-dom/client';
import { HeaderApp, type HeaderAppProps } from './HeaderApp.js';
import { setUrlPath } from './UrlPathContext/UrlPathContext.js';

const v1RenderWithEntryPointValues = (
  entryPointValues: HeaderAppProps['entryPointValues'],
  options: Parameters<V1Render>[0],
): ReturnType<V1Render> => {
  const { rootElement, initialUrlPath } = options;

  ReactDOM.createRoot(rootElement).render(
    <HeaderApp entryPointValues={entryPointValues} initialUrlPath={initialUrlPath} />,
  );

  return (newOptions) => {
    const { newUrlPath } = newOptions;
    if (newUrlPath != null) {
      setUrlPath(newUrlPath);
    }
  };
};

export { v1RenderWithEntryPointValues };

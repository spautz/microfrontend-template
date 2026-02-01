import type {
  V1Header_RehydrateOptions,
  V1Header_RehydrateReturn,
} from '@spautz/myheader-api-contracts/v1';
import ReactDOM from 'react-dom/client';
import { HeaderApp, type HeaderAppProps } from './HeaderApp.js';
import { setUrlPath } from './UrlPathContext/UrlPathContext.js';

const v1Header_rehydrateWithEntryPointValues = (
  entryPointValues: HeaderAppProps['entryPointValues'],
  options: V1Header_RehydrateOptions,
): V1Header_RehydrateReturn => {
  const { rootElement, initialUrlPath } = options;

  const root = ReactDOM.hydrateRoot(
    rootElement,
    <HeaderApp entryPointValues={entryPointValues} initialUrlPath={initialUrlPath ?? ''} />,
  );

  return {
    setNewOptions: (newOptions) => {
      const { newUrlPath } = newOptions;
      if (newUrlPath != null) {
        setUrlPath(newUrlPath);
      }
    },
    unmount() {
      root.unmount();
    },
  };
};

export { v1Header_rehydrateWithEntryPointValues };

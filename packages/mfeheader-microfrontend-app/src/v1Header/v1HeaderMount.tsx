import type {
  V1Header_MountOptions,
  V1Header_MountReturn,
} from '@spautz/mfeheader-api-contracts/v1';
import ReactDOM from 'react-dom/client';
import { HeaderApp, type HeaderAppProps } from './HeaderApp.js';
import { setUrlPath } from './UrlPathContext/UrlPathContext.js';

const v1Header_mountWithEntryPointValues = (
  entryPointValues: HeaderAppProps['entryPointValues'],
  options: V1Header_MountOptions,
): V1Header_MountReturn => {
  const { rootElement, initialUrlPath } = options;

  const root = ReactDOM.createRoot(rootElement);
  root.render(
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

export { v1Header_mountWithEntryPointValues };

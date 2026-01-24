import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';

const UrlPathContext = createContext<string>('');

/**
 * If the host app sends us a new string, we'll update it through here.
 * (This is just the typing for a `setState` function)
 */
let internal_setStateForUrlPath: ((value: string | ((prev: string) => string)) => void) | null =
  null;

const setUrlPath = (newUrlPath: string) => {
  if (!internal_setStateForUrlPath) {
    throw new Error(
      'Cannot setUrlPath for the Header microfrontend unless the Header is mounted. This error should never happen.',
    );
  }
  internal_setStateForUrlPath(newUrlPath);
};

interface UrlPathProviderProps {
  initialUrlPath: string;
  children: ReactNode;
}

const UrlPathProvider = (props: UrlPathProviderProps) => {
  const { initialUrlPath, children } = props;
  const [urlPath, setUrlPath] = useState<string>(initialUrlPath);

  // Allow our setState to be called from outside, via setUrlPath
  useEffect(() => {
    internal_setStateForUrlPath = setUrlPath;
    return () => {
      internal_setStateForUrlPath = null;
    };
  }, [setUrlPath]);

  return <UrlPathContext.Provider value={urlPath}> {children};</UrlPathContext.Provider>;
};

const useUrlPath = (): string => {
  const context = useContext(UrlPathContext);
  if (!context) {
    throw new Error('useUrlPath must be used within a <UrlPathProvider>');
  }

  return context;
};

export { UrlPathProvider, setUrlPath, useUrlPath };

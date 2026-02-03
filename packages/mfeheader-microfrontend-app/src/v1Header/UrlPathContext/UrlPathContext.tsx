import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';

const UrlPathContext = createContext<UrlPath>(undefined);

type UrlPath = string | null | undefined;
// This is just the typing for a `setState`
type NewUrlPathValue = UrlPath | ((prev: UrlPath) => UrlPath);

/**
 * If the host app sends us a new string, we'll update it through here.
 */
let internal_setStateForUrlPath: ((value: NewUrlPathValue) => void) | null = null;

/**
 * If setUrlPath() is called before the Provider has rendered (i.e., internal_setStateForUrlPath
 * hasn't been set yet), we'll stash the value here
 */
let pendingUrlPathValueBeforeMount: NewUrlPathValue | null = null;

const setUrlPath = (urlPath: NewUrlPathValue) => {
  if (internal_setStateForUrlPath == null) {
    // Provider hasn't rendered yet: we're probably between the call to hydrateRoot and the firing
    // of useEffect. Store the value and let the Provider apply it on mount.
    pendingUrlPathValueBeforeMount = urlPath;
    return;
  }

  internal_setStateForUrlPath(urlPath);
};

interface UrlPathProviderProps {
  initialUrlPath: UrlPath;
  children: ReactNode;
}

const UrlPathProvider = (props: UrlPathProviderProps) => {
  const { initialUrlPath, children } = props;
  const [urlPath, setUrlPath] = useState<UrlPath>(initialUrlPath);
  // Ensure we don't have any old queued value hanging around
  pendingUrlPathValueBeforeMount = initialUrlPath;

  // Allow our setState to be called from outside, via setUrlPath (and clear it on unmount)
  useEffect(() => {
    internal_setStateForUrlPath = setUrlPath;

    // Apply the latest queued value (whether it came pre-render or between render/effect)
    setUrlPath(pendingUrlPathValueBeforeMount);

    return () => {
      internal_setStateForUrlPath = null;
    };
  }, []);

  return <UrlPathContext.Provider value={urlPath}>{children}</UrlPathContext.Provider>;
};

const useUrlPath = (): UrlPath => {
  return useContext(UrlPathContext);
};

export { UrlPathProvider, setUrlPath, useUrlPath };

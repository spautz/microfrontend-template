'use client';

import { type HeaderLocale, rehydrateHeader } from '@spautz/myheader-sdk';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

type HeaderClientProps = {
  rootId: string;
  locale: HeaderLocale;
};

const reportError = (error: Error, ...details: unknown[]): void => {
  // biome-ignore lint/suspicious/noConsole: Demo logging only.
  console.error(error, ...details);
};

export function HeaderClient({ rootId, locale }: HeaderClientProps): null {
  const pathname = usePathname();
  const headerCallbacks = useRef<Awaited<ReturnType<typeof rehydrateHeader>>>(null);
  const latestPathRef = useRef(pathname);

  // Keep the header's urlPath in sync with the browser
  useEffect(() => {
    latestPathRef.current = pathname;

    if (headerCallbacks.current) {
      headerCallbacks.current.setNewOptions({ newUrlPath: pathname });
    }
  }, [pathname]);

  useEffect(() => {
    const rootElement = document.getElementById(rootId);
    if (!rootElement) {
      return undefined;
    }

    let wasUnmounted = false;

    void rehydrateHeader({
      baseUrl: new URL(process.env.NEXT_PUBLIC_HEADER_BROWSER_BASE_URL, window.location.origin),
      locale,
      rootElement,
      initialUrlPath: latestPathRef.current,
      onInitializationError: reportError,
      onUncaughtRuntimeError: reportError,
      // NextJS can't/won't pass through dynamic imports from packages, so we have to inject
      // our own `import()` resolver
      doDynamicImport: (url) => import(/* turbopackIgnore: true */ url),
    }).then((result) => {
      if (wasUnmounted || !result) {
        return;
      }
      headerCallbacks.current = result;
      result.setNewOptions({ newUrlPath: latestPathRef.current });
    });

    return () => {
      wasUnmounted = true;
      headerCallbacks.current?.unmount();
      headerCallbacks.current = null;
    };
    // `locale` and `rootId` should never change, so this should only run on mount/unmount
  }, [locale, rootId]);

  return null;
}

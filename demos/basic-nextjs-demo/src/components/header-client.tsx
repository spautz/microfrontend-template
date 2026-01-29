'use client';

import { createRemoteEntryLoader, rehydrateHeader } from '@spautz/header-sdk';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

type HeaderController = Exclude<Awaited<ReturnType<typeof rehydrateHeader>>, Error>;

const loadRemoteEntry = createRemoteEntryLoader(
  (remoteEntryUrl) => import(/* @vite-ignore */ /* webpackIgnore: true */ remoteEntryUrl),
);

export function HeaderClient(): null {
  const pathname = usePathname();
  const headerControllerRef = useRef<HeaderController | null>(null);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (hasMountedRef.current) {
      return;
    }
    hasMountedRef.current = true;

    const rootElement = document.getElementById('header');
    if (!rootElement) {
      return;
    }

    void rehydrateHeader({
      // biome-ignore lint/suspicious/noConsole: Local dev doesn't need real reporting: the console is enough
      onInitializationError: console.error,
      // biome-ignore lint/suspicious/noConsole: Local dev doesn't need real reporting: the console is enough
      onUncaughtRuntimeError: console.error,
      baseUrl: new URL('/proxy-to-mfe/', window.location.origin),
      locale: 'en-US',
      loadRemoteEntry,
      rootElement,
      initialUrlPath: pathname,
    }).then((result) => {
      if (result instanceof Error) {
        return;
      }
      headerControllerRef.current = result;
    });
  }, [pathname]);

  useEffect(() => {
    if (!headerControllerRef.current) {
      return;
    }
    headerControllerRef.current.setNewOptions({ newUrlPath: pathname });
  }, [pathname]);

  return null;
}

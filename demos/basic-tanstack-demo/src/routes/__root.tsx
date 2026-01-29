import { createRemoteEntryLoader, rehydrateHeader } from '@spautz/header-sdk';
import type { OptionsForGetPrerenderedHeader } from '@spautz/header-sdk/server';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { createRootRoute, HeadContent, Scripts, useLocation } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { useEffect, useRef } from 'react';

import appCss from '../styles.css?url';

type HeaderController = Exclude<Awaited<ReturnType<typeof rehydrateHeader>>, Error>;
type HeaderEnv = {
  HEADER_SOURCE?: string;
  HEADER_SOURCE_BASEURL?: string;
  HEADER_LOCALE?: string;
  HEADER_URL_PATH?: string;
};

const HEADER_SOURCE_PRESETS = {
  local: 'http://localhost:3000/',
  staging: 'http://localhost:3000/',
  production: 'http://localhost:3000/',
};
const DEFAULT_HEADER_SOURCE = HEADER_SOURCE_PRESETS.local;
const ENABLE_LOCAL_FALLBACK_FOR_HEADER = true;
const loadRemoteEntry = createRemoteEntryLoader(
  (remoteEntryUrl) => import(/* @vite-ignore */ /* webpackIgnore: true */ remoteEntryUrl),
);

const resolveHeaderBaseUrl = (env: HeaderEnv): string => {
  const requestedHeaderSource = env.HEADER_SOURCE;
  const requestedHeaderBaseUrl = env.HEADER_SOURCE_BASEURL;

  if (requestedHeaderSource && requestedHeaderBaseUrl) {
    throw new Error('Please specify either HEADER_SOURCE or HEADER_SOURCE_BASEURL, not both.');
  }

  if (requestedHeaderSource) {
    if (!Object.hasOwn(HEADER_SOURCE_PRESETS, requestedHeaderSource)) {
      throw new Error(
        `Invalid HEADER_SOURCE: must be one of ${Object.keys(HEADER_SOURCE_PRESETS).join(', ')}.`,
      );
    }
    return HEADER_SOURCE_PRESETS[requestedHeaderSource as keyof typeof HEADER_SOURCE_PRESETS];
  }

  return requestedHeaderBaseUrl || DEFAULT_HEADER_SOURCE;
};

const getHeaderHtml = async (env: HeaderEnv, headerUrlPath: string | null): Promise<string> => {
  const headerBaseUrl = resolveHeaderBaseUrl(env);
  const headerLocale = (env.HEADER_LOCALE ?? null) as OptionsForGetPrerenderedHeader['locale'];

  const parsedHeaderBaseUrl = new URL(headerBaseUrl).toString();
  if (parsedHeaderBaseUrl !== headerBaseUrl) {
    throw new Error(
      `headerBaseUrl "${headerBaseUrl}" did not parse cleanly: please check that it is a valid URL.`,
    );
  }

  const optionsForHeaderPrerender: OptionsForGetPrerenderedHeader = {
    baseUrl: headerBaseUrl,
    initialUrlPath: headerUrlPath,
    locale: headerLocale,
    onInitializationError: (_message: unknown, error: unknown) => {
      throw error;
    },
    onUncaughtRuntimeError: (error: unknown) => {
      throw error;
    },
  };

  const { getPrerenderedHeader, resolveLocalFallbackPrerenderUrl } = await import(
    '@spautz/header-sdk/server'
  );

  try {
    return (await getPrerenderedHeader(optionsForHeaderPrerender)) as string;
  } catch (error) {
    if (!ENABLE_LOCAL_FALLBACK_FOR_HEADER) {
      throw error;
    }
    const { readFile } = await import('node:fs/promises');
    return readFile(resolveLocalFallbackPrerenderUrl(optionsForHeaderPrerender), 'utf8');
  }
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  loader: async ({ location }) => {
    if (!import.meta.env.SSR) {
      return { headerHtml: '' };
    }

    const env = process.env as HeaderEnv;
    const headerUrlPath = env.HEADER_URL_PATH ?? location.pathname;
    const headerHtml = await getHeaderHtml(env, headerUrlPath);

    return { headerHtml };
  },
  staleTime: Number.POSITIVE_INFINITY,

  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const { headerHtml } = Route.useLoaderData();
  const location = useLocation();
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
      initialUrlPath: location.pathname,
    }).then((result) => {
      if (result instanceof Error) {
        return;
      }
      headerControllerRef.current = result;
    });
  }, [location.pathname]);

  useEffect(() => {
    if (!headerControllerRef.current) {
      return;
    }
    headerControllerRef.current.setNewOptions({ newUrlPath: location.pathname });
  }, [location.pathname]);

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: prerendered header HTML is trusted */}
        <div id="header" dangerouslySetInnerHTML={{ __html: headerHtml }} />
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}

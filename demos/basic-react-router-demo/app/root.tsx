import { createRemoteEntryLoader, rehydrateHeader } from '@spautz/header-sdk';
import type { OptionsForGetPrerenderedHeader } from '@spautz/header-sdk/server';
import { useEffect, useRef } from 'react';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from 'react-router';

import type { Route } from './+types/root';
import './app.css';
import type { JSX } from 'react/jsx-runtime';

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

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export const loader = async ({ request }: Route.LoaderArgs): Promise<{ headerHtml: string }> => {
  if (!import.meta.env.SSR) {
    return { headerHtml: '' };
  }

  const env = process.env as HeaderEnv;
  const headerUrlPath = env.HEADER_URL_PATH ?? new URL(request.url).pathname;
  const headerHtml = await getHeaderHtml(env, headerUrlPath);

  return { headerHtml };
};

export const shouldRevalidate = (): boolean => false;

export function Layout({ children }: { children: React.ReactNode }): JSX.Element {
  const { headerHtml } = useLoaderData<typeof loader>();
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
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: prerendered header HTML is trusted */}
        <div id="header" dangerouslySetInnerHTML={{ __html: headerHtml }} />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App(): JSX.Element {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps): JSX.Element {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

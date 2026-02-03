import 'server-only';

import {
  buildUrlOrPath,
  getHeaderAssetsManifest,
  type HeaderLocale,
  type OptionsForGetHeaderAssetsManifest,
} from '@spautz/mfeheader-sdk/server';
import { headers } from 'next/headers';
import React from 'react';
import type { JSX } from 'react/jsx-runtime';

const DEFAULT_HEADER_LOCALE = 'en-US';

const reportServerError = (error: Error, ...extraDetails: Array<unknown>): void => {
  // biome-ignore lint/suspicious/noConsole: Demo logging only.
  console.error(error, ...extraDetails);
};

const getHeaderBaseUrlForBrowser = (): string => {
  const rawBaseUrl = process.env.NEXT_PUBLIC_HEADER_BROWSER_BASE_URL;
  if (!rawBaseUrl) {
    throw new Error('Header base URL was not resolved. Set HEADER_SERVER_BASE_URL.');
  }
  return rawBaseUrl;
};

const getHeaderBaseUrlForServer = (): string => {
  const rawBaseUrl = process.env.HEADER_SERVER_BASE_URL;
  if (!rawBaseUrl) {
    throw new Error('Header base URL was not resolved. Set HEADER_SERVER_BASE_URL.');
  }
  // Parse to ensure it's valid
  const headerBaseUrl = new URL(rawBaseUrl);
  return headerBaseUrl.toString();
};

const getRequestUrl = (requestHeaders: Awaited<ReturnType<typeof headers>>): URL | null => {
  const requestUrl = requestHeaders.get('next-url') ?? requestHeaders.get('x-nextjs-original-url');
  return requestUrl ? new URL(requestUrl, 'http://localhost') : null;
};

const getLocaleFromRequest = (
  requestHeaders: Awaited<ReturnType<typeof headers>>,
  requestUrl: URL | null,
): HeaderLocale => {
  const localeFromQuery = requestUrl?.searchParams.get('locale');
  if (localeFromQuery) {
    return localeFromQuery as HeaderLocale;
  }

  const acceptLanguage = requestHeaders.get('accept-language');
  const localeFromHeader = acceptLanguage?.split(',')[0]?.split(';')[0]?.trim();
  return (localeFromHeader as HeaderLocale) || DEFAULT_HEADER_LOCALE;
};

export async function HeaderAssets(): Promise<JSX.Element> {
  const headerBaseUrlBrowser = getHeaderBaseUrlForBrowser();
  const headerBaseUrlServer = getHeaderBaseUrlForServer();
  const headersList = await headers();
  const requestUrl = getRequestUrl(headersList);
  const headerLocale = getLocaleFromRequest(headersList, requestUrl);

  // Normally we'd just get the finished html to include in the head, but Next requires
  // RSC-compatible output -- so we'll build the html ourselves from the manifest.
  const headerAssetsManifest = await getHeaderAssetsManifest({
    baseUrl: headerBaseUrlServer,
    locale: headerLocale as OptionsForGetHeaderAssetsManifest['locale'],
    onInitializationError: reportServerError,
    onUncaughtRuntimeError: reportServerError,
  });

  if (!headerAssetsManifest) {
    return <React.Fragment />;
  }

  const { css, js } = headerAssetsManifest;
  return (
    <>
      {!!js &&
        js.map((jsFile) => (
          <link
            key={jsFile}
            rel="modulepreload"
            href={buildUrlOrPath(headerBaseUrlBrowser, jsFile)}
          />
        ))}
      {!!css &&
        css.map((cssFile) => (
          <link
            key={cssFile}
            rel="stylesheet"
            href={buildUrlOrPath(headerBaseUrlBrowser, cssFile)}
          />
        ))}
    </>
  );
}

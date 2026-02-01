import 'server-only';

import {
  getPrerenderedHeader,
  type HeaderLocale,
  type OptionsForGetPrerenderedHeader,
} from '@spautz/myheader-sdk/server';
import { headers } from 'next/headers';
import type { JSX } from 'react/jsx-runtime';
import { HeaderClient } from './header-client';

const HEADER_ROOT_ELEMENT_ID = 'header-mfe';
const DEFAULT_HEADER_LOCALE = 'en-US';

const reportServerError = (error: Error, ...extraDetails: Array<unknown>): void => {
  // biome-ignore lint/suspicious/noConsole: Demo logging only.
  console.error(error, ...extraDetails);
};

const getHeaderBaseUrlForServer = (): string => {
  const headerBaseUrl = process.env.HEADER_SERVER_BASE_URL;
  if (!headerBaseUrl) {
    throw new Error('Header base URL was not resolved. Set HEADER_SERVER_BASE_URL.');
  }
  return new URL(headerBaseUrl).toString();
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

export async function Header(): Promise<JSX.Element> {
  const headerBaseUrl = getHeaderBaseUrlForServer();
  const headersList = await headers();
  const requestUrl = getRequestUrl(headersList);
  const headerLocale = getLocaleFromRequest(headersList, requestUrl);
  const initialUrlPath = requestUrl?.pathname ?? '/';

  let html: string | null = null;

  const result = await getPrerenderedHeader({
    baseUrl: headerBaseUrl,
    initialUrlPath,
    locale: headerLocale as OptionsForGetPrerenderedHeader['locale'],
    onInitializationError: reportServerError,
    onUncaughtRuntimeError: reportServerError,
  });

  if (result) {
    html = result;
  }

  return (
    <>
      <div
        id={HEADER_ROOT_ELEMENT_ID}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Intentional injection from trusted source
        dangerouslySetInnerHTML={html ? { __html: html } : undefined}
      />
      <HeaderClient rootId={HEADER_ROOT_ELEMENT_ID} locale={headerLocale} />
    </>
  );
}

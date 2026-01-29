import { readFile } from 'node:fs/promises';
import {
  getPrerenderedHeader,
  type OptionsForGetPrerenderedHeader,
  resolveLocalFallbackPrerenderUrl,
} from '@spautz/header-sdk/server';

const HEADER_SOURCE_PRESETS = {
  local: 'http://localhost:3000/',
  staging: 'http://localhost:3000/',
  production: 'http://localhost:3000/',
};
const DEFAULT_HEADER_SOURCE = HEADER_SOURCE_PRESETS.local;
const ENABLE_LOCAL_FALLBACK_FOR_HEADER = true;

const resolveHeaderBaseUrl = (): string => {
  const env = process.env as {
    HEADER_SOURCE?: string;
    HEADER_SOURCE_BASEURL?: string;
  };
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

const loadLocalFallbackPrerender = async (
  options: OptionsForGetPrerenderedHeader,
): Promise<string> => {
  const resolvedUrl = resolveLocalFallbackPrerenderUrl(options);
  return readFile(resolvedUrl, 'utf8');
};

const getHeaderHtml = async (): Promise<string> => {
  const env = process.env as {
    HEADER_LOCALE?: string;
    HEADER_URL_PATH?: string;
  };
  const headerBaseUrl = resolveHeaderBaseUrl();
  const headerLocale = env.HEADER_LOCALE ?? null;
  const headerUrlPath = env.HEADER_URL_PATH ?? null;

  const parsedHeaderBaseUrl = new URL(headerBaseUrl).toString();
  if (parsedHeaderBaseUrl !== headerBaseUrl) {
    throw new Error(
      `headerBaseUrl "${headerBaseUrl}" did not parse cleanly: please check that it is a valid URL.`,
    );
  }

  const optionsForHeaderPrerender: OptionsForGetPrerenderedHeader = {
    baseUrl: headerBaseUrl,
    initialUrlPath: headerUrlPath,
    locale: headerLocale as OptionsForGetPrerenderedHeader['locale'],
    onInitializationError: (_message: unknown, error: unknown) => {
      throw error;
    },
    onUncaughtRuntimeError: (error: unknown) => {
      throw error;
    },
  };

  try {
    return (await getPrerenderedHeader(optionsForHeaderPrerender)) as string;
  } catch (error) {
    if (!ENABLE_LOCAL_FALLBACK_FOR_HEADER) {
      throw error;
    }
    return loadLocalFallbackPrerender(optionsForHeaderPrerender);
  }
};

export { getHeaderHtml };

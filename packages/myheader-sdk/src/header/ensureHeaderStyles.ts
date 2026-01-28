type EnsureHeaderStylesOptions = {
  baseUrl: string | URL;
  entryPointIdentifier: string;
};

type AssetIncludePayload = {
  css?: string[];
  js?: string[];
};

const STYLE_DATASET_KEY = 'mfeStyle';
const LOADED_DATASET_KEY = 'mfeLoaded';

const stylesheetLoadPromises = new Map<string, Promise<void>>();

const findStylesheetLink = (href: string): HTMLLinkElement | null => {
  const links = document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]');
  for (const link of Array.from(links)) {
    if (link.dataset[STYLE_DATASET_KEY] === href) {
      return link;
    }
    if (link.href === href || link.getAttribute('href') === href) {
      return link;
    }
  }
  return null;
};

const isStylesheetLoaded = (link: HTMLLinkElement): boolean =>
  link.dataset[LOADED_DATASET_KEY] === 'true' || Boolean(link.sheet);

const waitForStylesheet = (
  link: HTMLLinkElement,
  href: string,
  deleteOnError: boolean,
): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    const onLoad = () => {
      link.dataset[LOADED_DATASET_KEY] = 'true';
      link.removeEventListener('load', onLoad);
      link.removeEventListener('error', onError);
      resolve();
    };
    const onError = () => {
      link.removeEventListener('load', onLoad);
      link.removeEventListener('error', onError);
      if (deleteOnError) {
        stylesheetLoadPromises.delete(href);
      }
      reject(new Error(`Failed to load ${href}`));
    };

    link.addEventListener('load', onLoad);
    link.addEventListener('error', onError);
  });

const createStylesheetLink = (href: string): HTMLLinkElement => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.dataset[STYLE_DATASET_KEY] = href;
  return link;
};

const loadStylesheet = (href: string): Promise<void> => {
  const cachedPromise = stylesheetLoadPromises.get(href);
  if (cachedPromise) {
    return cachedPromise;
  }

  const existingLink = findStylesheetLink(href);
  if (existingLink) {
    const existingPromise = isStylesheetLoaded(existingLink)
      ? Promise.resolve()
      : waitForStylesheet(existingLink, href, false);
    stylesheetLoadPromises.set(href, existingPromise);
    return existingPromise;
  }

  const link = createStylesheetLink(href);
  const loadPromise = waitForStylesheet(link, href, true);
  stylesheetLoadPromises.set(href, loadPromise);
  document.head.appendChild(link);
  return loadPromise;
};

const ensureHeaderStyles = async ({
  baseUrl,
  entryPointIdentifier,
}: EnsureHeaderStylesOptions): Promise<void> => {
  if (typeof document === 'undefined' || typeof fetch !== 'function') {
    return;
  }

  const includeUrl = new URL(`asset-include/${entryPointIdentifier}.json`, baseUrl).toString();

  try {
    const response = await fetch(includeUrl);
    if (!response.ok) {
      return;
    }

    const payload = (await response.json()) as AssetIncludePayload;
    const cssFiles = Array.isArray(payload.css) ? payload.css : [];
    const cssUrls = cssFiles.map((file) => new URL(file, baseUrl).toString());
    await Promise.all(cssUrls.map((url) => loadStylesheet(url)));
  } catch {
    // We don't care if a *prefetch* failed. The real test will be in the microfrontend itself,
    // which comes later.
    return;
  }
};

export { ensureHeaderStyles };

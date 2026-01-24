import type { ReactNode } from 'react';

const ENTRY_POINT__HEADER = './Header';
const ENTRY_POINT__RENDER = './render';

interface HeaderModuleEntryPoints {
  [ENTRY_POINT__HEADER]: {
    Header: ReactNode;
  };
  [ENTRY_POINT__RENDER]: {
    renderV1(placeholderEl: HTMLElement): void;
  };
}

const importHeaderModule = async <EntryPoint extends keyof HeaderModuleEntryPoints>(
  baseUrl: string,
  entryPoint: EntryPoint,
): Promise<HeaderModuleEntryPoints[EntryPoint]> => {
  const moduleUrl = new URL('header-mfe/assets/remoteEntry-header.js', baseUrl);
  const headerRemoteEntry = await import(moduleUrl.toString());
  const entryPointModule = (await headerRemoteEntry.get(entryPoint))();
  return entryPointModule;
};

const headerModuleEntryPointCache = Object.create(null);

const getHeaderModule: typeof importHeaderModule = async (baseUrl, entryPoint) => {
  if (!Object.hasOwn(headerModuleEntryPointCache, baseUrl)) {
    headerModuleEntryPointCache[baseUrl] = {};
  }
  if (!Object.hasOwn(headerModuleEntryPointCache[baseUrl], entryPoint)) {
    headerModuleEntryPointCache[baseUrl][entryPoint] = await importHeaderModule(
      baseUrl,
      entryPoint,
    );
  }
  return headerModuleEntryPointCache[baseUrl][entryPoint];
};

// Exposed API:

const prefetchHeaderModule = async (baseUrl: string) => {
  getHeaderModule(baseUrl, ENTRY_POINT__RENDER);
};

const getRenderFn = async (baseUrl: string) => {
  const renderEntryPoint = await getHeaderModule(baseUrl, ENTRY_POINT__RENDER);
  return renderEntryPoint.renderV1;
};

export { prefetchHeaderModule, getRenderFn };

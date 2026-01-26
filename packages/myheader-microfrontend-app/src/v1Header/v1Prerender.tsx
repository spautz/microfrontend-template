import type { V1Render } from '@spautz/header-api-contracts';
import { renderToStaticMarkup } from 'react-dom/server';

import { HeaderApp, type HeaderAppProps } from './HeaderApp.js';

const v1PrerenderWithEntryPointValues = async (
  entryPointValues: HeaderAppProps['entryPointValues'],
  options: Parameters<V1Render>[0],
): Promise<string> => {
  const { initialUrlPath = '' } = options;
  return renderToStaticMarkup(
    <HeaderApp entryPointValues={entryPointValues} initialUrlPath={initialUrlPath} />,
  );
};

export { v1PrerenderWithEntryPointValues };

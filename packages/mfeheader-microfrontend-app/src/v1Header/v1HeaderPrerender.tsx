import type {
  V1Header_PrerenderOptions,
  V1Header_PrerenderReturn,
} from '@spautz/mfeheader-api-contracts/v1';
import { renderToStaticMarkup } from 'react-dom/server';

import { HeaderApp, type HeaderAppProps } from './HeaderApp.js';

const v1Header_prerenderWithEntryPointValues = async (
  entryPointValues: HeaderAppProps['entryPointValues'],
  options: V1Header_PrerenderOptions,
): Promise<V1Header_PrerenderReturn> => {
  const { initialUrlPath } = options;
  return renderToStaticMarkup(
    <HeaderApp entryPointValues={entryPointValues} initialUrlPath={initialUrlPath ?? ''} />,
  );
};

export { v1Header_prerenderWithEntryPointValues };

// This entry point resolves *html for node/server use* from the microfrontend.
// See `index.ts` for resolving Javascript, for browser environments.

import type { V1FetchParams } from '@spautz/myheader-api-contracts/v1';

export * from './header/getPrerenderedHeader.js';
export { getRemoteEntryPointIdentifier } from './resolveRemoteEntry.js';

type HeaderLocale = V1FetchParams['locale'];

export type { HeaderLocale };

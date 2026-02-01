// This entry point resolves *Javascript for the browser* from the microfrontend.
// See `serverIndex.ts` for resolving html, for server/node environments.

export * from './header/mountHeader.ts';
export * from './header/rehydrateHeader.ts';

import type { V1FetchParams } from '@spautz/myheader-api-contracts/v1';

type HeaderLocale = V1FetchParams['locale'];

export type { HeaderLocale };

// This entry point resolves *html for node/server use* from the microfrontend.
// See `index.ts` for resolving Javascript, for browser environments.

import type { V1FetchParams } from '@spautz/mfeheader-api-contracts/v1';

export * from './header/getHeaderAssetsHTML.js';
export * from './header/getHeaderAssetsManifest.js';
export * from './header/getHeaderAssetsManifest.js';
export * from './header/getHeaderAssetsPrefetchHTML.js';
export * from './header/getHeaderPrerenderHTML.js';

type HeaderLocale = V1FetchParams['locale'];

export type { HeaderLocale };

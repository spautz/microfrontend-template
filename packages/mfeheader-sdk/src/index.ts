// This entry point resolves *Javascript for the browser* from the microfrontend.
// See `serverIndex.ts` for resolving html, for server/node environments.

import type { V1FetchParams } from '@spautz/mfeheader-api-contracts/v1';
import { buildFullUrl, buildUrlOrPath } from '@spautz/mfeheader-api-contracts/v1';

export * from './header/getHeaderAssetsManifest.js';
export * from './header/mountHeader.ts';
export * from './header/rehydrateHeader.ts';

type HeaderLocale = V1FetchParams['locale'];

export type { HeaderLocale };
// @TODO: move these to mfe-utils package
export { buildUrlOrPath, buildFullUrl };

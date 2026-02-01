// This entry point resolves *html for node/server use* from the microfrontend.
// See `index.ts` for resolving Javascript, for browser environments.

export * from './header/getPrerenderedHeader.js';
export { getRemoteEntryPointIdentifier } from './resolveRemoteEntry.js';

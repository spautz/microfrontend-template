// This entry point resolves *Javascript for the browser* from the microfrontend.
// See `serverIndex.ts` for resolving html, for server/node environments.

export * from './header/mountHeader.ts';
export * from './header/rehydrateHeader.ts';
export {
  createRemoteEntryLoader,
  type RemoteEntryImporter,
  type RemoteEntryLoader,
} from './loadRemoteEntryContainer.ts';

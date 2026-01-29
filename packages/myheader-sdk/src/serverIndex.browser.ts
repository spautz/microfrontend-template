const serverOnly = (methodName: string): never => {
  throw new Error(
    `@spautz/header-sdk/server is server-only; "${methodName}" cannot be used in the browser.`,
  );
};

const getPrerenderedHeader = async (..._args: unknown[]): Promise<never> =>
  serverOnly('getPrerenderedHeader');
const getRemoteEntryPointIdentifier = (..._args: unknown[]): never =>
  serverOnly('getRemoteEntryPointIdentifier');
const resolveLocalFallbackPrerenderUrl = (..._args: unknown[]): never =>
  serverOnly('resolveLocalFallbackPrerenderUrl');

export type { OptionsForGetPrerenderedHeader } from './header/getPrerenderedHeader.js';
export { getPrerenderedHeader, getRemoteEntryPointIdentifier, resolveLocalFallbackPrerenderUrl };

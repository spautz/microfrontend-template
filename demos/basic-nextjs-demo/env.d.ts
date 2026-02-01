declare namespace NodeJS {
  interface ProcessEnv {
    // For dev mode only: sets the source of the header microfrontend, in `next.config.ts`
    HEADER_PRESET_LOCALDEV?: 'local' | 'staging' | 'production';
    HEADER_BASEURL_LOCALDEV?: string;
    // For the app itself
    // In dev mode, the header's baseUrl (NEXT_PUBLIC_HEADER_BROWSER_BASE_URL) will always be
    // `/proxy-to-mfe/`, which gets mapped to the header's actual baseUrl in `next.config.ts`
    HEADER_SERVER_BASE_URL: string;
    NEXT_PUBLIC_HEADER_BROWSER_BASE_URL: string;
  }
}

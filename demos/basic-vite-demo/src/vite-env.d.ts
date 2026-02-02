/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly HEADER_PRESET_LOCALDEV?: string;
  readonly HEADER_BASEURL_LOCALDEV?: string;
  readonly HEADER_LOCALE?: string;
  readonly HEADER_URL_PATH?: string;
  readonly VITE_HEADER_BROWSER_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

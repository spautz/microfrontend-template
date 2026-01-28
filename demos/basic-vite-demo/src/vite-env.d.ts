/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly HEADER_SOURCE?: string;
  readonly HEADER_SOURCE_BASEURL?: string;
  readonly HEADER_LOCALE?: string;
  readonly HEADER_URL_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

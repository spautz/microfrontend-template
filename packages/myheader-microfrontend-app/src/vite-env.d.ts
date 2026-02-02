/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NEXTJS_APP_BASEURL: string;
  readonly VITE_REACT_ROUTER_APP_BASEURL: string;
  readonly VITE_TANSTACK_APP_BASEURL: string;
  readonly VITE_VITE_APP_BASEURL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

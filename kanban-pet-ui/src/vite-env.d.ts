/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

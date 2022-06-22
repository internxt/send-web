/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PUBLIC_URL: string;
    REACT_APP_API_URL: string;
    REACT_APP_CRYPTO_SECRET: string;
    REACT_APP_CRYPTO_SECRET2: string;
    REACT_APP_NETWORK_URL: string;
    REACT_APP_PROXY: string;

    REACT_APP_SEND_USER: string;
    REACT_APP_SEND_PASS: string;
    REACT_APP_SEND_ENCRYPTION_KEY: string;
    REACT_APP_SEND_BUCKET_ID: string;
  }
}

/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';

    REACT_APP_SEND_USER: string;
    REACT_APP_SEND_PASS: string;
    REACT_APP_MAGIC_IV: string;
    REACT_APP_MAGIC_SALT: string;
    REACT_APP_GA_ID: string;
    REACT_APP_NETWORK_URL: string;
    REACT_APP_SEND_ENCRYPTION_KEY: string;
    REACT_APP_SEND_BUCKET_ID: string;
    REACT_APP_STRIPE_PK: string;
    REACT_APP_STRIPE_TEST_PK: string;
    REACT_APP_SENTRY_DSN: string;
    REACT_APP_SEND_API_URL: string;
    REACT_APP_RECAPTCHA_V3: string;
  }
}

interface Window {
  grecaptcha: {
    ready: (cb: () => void) => void;
    execute: (siteKey: string, { action: string }) => Promise<string>;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gtag: any;
}

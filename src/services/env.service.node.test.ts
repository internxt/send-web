import { describe, it, expect, beforeAll, vi } from 'vitest';
import dotenv from 'dotenv';
import * as path from 'path';
import envService from './env.service';

describe('Check that env variables are loaded correctly', () => {
  beforeAll(() => {
    const envPath = path.join(process.cwd(), '.env.template');

    const result = dotenv.config({ path: envPath });

    if (result.error) {
      throw result.error;
    }
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('When an env variable are requested, then their value is successfully returned', async () => {
    expect(envService.getVariable('nodeEnv')).toBe(process.env.NODE_ENV);
    expect(envService.getVariable('sendUser')).toBe(process.env.REACT_APP_SEND_USER);
    expect(envService.getVariable('sendPass')).toBe(process.env.REACT_APP_SEND_PASS);
    expect(envService.getVariable('magicIv')).toBe(process.env.REACT_APP_MAGIC_IV);
    expect(envService.getVariable('magicSalt')).toBe(process.env.REACT_APP_MAGIC_SALT);
    expect(envService.getVariable('gaId')).toBe(process.env.REACT_APP_GA_ID);
    expect(envService.getVariable('networkUrl')).toBe(process.env.REACT_APP_NETWORK_URL);
    expect(envService.getVariable('sendEncryptionKey')).toBe(process.env.REACT_APP_SEND_ENCRYPTION_KEY);
    expect(envService.getVariable('sendBucketId')).toBe(process.env.REACT_APP_SEND_BUCKET_ID);
    expect(envService.getVariable('stripePublicKey')).toBe(process.env.REACT_APP_STRIPE_PK);
    expect(envService.getVariable('stripeTestPublicKey')).toBe(process.env.REACT_APP_STRIPE_TEST_PK);
    expect(envService.getVariable('sentryDsn')).toBe(process.env.REACT_APP_SENTRY_DSN);
    expect(envService.getVariable('sendApiUrl')).toBe(process.env.REACT_APP_SEND_API_URL);
    expect(envService.getVariable('recaptchaV3')).toBe(process.env.REACT_APP_RECAPTCHA_V3);
  });

  it('When the endpoints variables are requested, then the value is actually an endpoint variable', async () => {
    const urlPattern = /^https?:\/\/.+/;

    expect(envService.getVariable('networkUrl')).toMatch(urlPattern);
    expect(envService.getVariable('sendApiUrl')).toMatch(urlPattern);
    expect(envService.getVariable('sentryDsn')).toMatch(urlPattern);
  });
});

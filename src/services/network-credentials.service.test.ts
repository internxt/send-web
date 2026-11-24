import { vi, describe, expect, beforeEach, afterEach, test } from 'vitest';
const getNetworkToken = vi.fn();
const getSend = vi.fn(() => ({ getNetworkToken }));

vi.mock('../lib/auth', () => ({
  getCaptchaToken: vi.fn().mockResolvedValue('captcha-token'),
}));
vi.mock('./sdk-manager.service', () => ({
  SdkManager: { instance: { getSend: (headers: Record<string, string>) => getSend(headers) } },
}));

const now = new Date('2026-01-01T00:00:00Z');
const tokenResponse = (token: string, expiresInSeconds: number) => ({
  user: 'network-token',
  token,
  bucketId: 'send-bucket-id',
  expiresIn: expiresInSeconds,
});
const twoHours = 2 * 60 * 60;

describe('Network credentials', () => {
  let getNetworkCredentials: typeof import('./network-credentials.service').getNetworkCredentials;

  beforeEach(async () => {
    vi.useFakeTimers().setSystemTime(now);
    getNetworkToken.mockReset();
    getSend.mockClear();
    vi.resetModules();
    ({ getNetworkCredentials } = await import('./network-credentials.service'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('When credentials are requested, then the temporary token is used as the network password', async () => {
    getNetworkToken.mockResolvedValueOnce(tokenResponse('network-jwt', twoHours));

    const credentials = await getNetworkCredentials();

    expect(getSend).toHaveBeenCalledWith({ 'x-internxt-captcha': 'captcha-token' });
    expect(credentials).toStrictEqual({ bucketId: 'send-bucket-id', user: 'network-token', pass: 'network-jwt' });
  });

  test('When the token is still valid, then it is reused', async () => {
    getNetworkToken.mockResolvedValueOnce(tokenResponse('network-jwt', twoHours));

    await getNetworkCredentials();
    const credentials = await getNetworkCredentials();

    expect(getNetworkToken).toHaveBeenCalledTimes(1);
    expect(credentials.pass).toBe('network-jwt');
  });

  test('When the token expires in less than an hour, then a new one is requested', async () => {
    getNetworkToken
      .mockResolvedValueOnce(tokenResponse('old-jwt', 59 * 60))
      .mockResolvedValueOnce(tokenResponse('new-jwt', twoHours));

    await getNetworkCredentials();
    const credentials = await getNetworkCredentials();

    expect(getNetworkToken).toHaveBeenCalledTimes(2);
    expect(credentials.pass).toBe('new-jwt');
  });

  test('When several requests happen at the same time, then only one token is requested', async () => {
    getNetworkToken.mockResolvedValueOnce(tokenResponse('network-jwt', twoHours));

    await Promise.all([getNetworkCredentials(), getNetworkCredentials(), getNetworkCredentials()]);

    expect(getNetworkToken).toHaveBeenCalledTimes(1);
  });
});

import { vi, describe, expect, beforeEach, afterEach, test } from 'vitest';
import axios from 'axios';

vi.mock('axios');
vi.mock('../lib/auth', () => ({
  getCaptchaToken: vi.fn().mockResolvedValue('captcha-token'),
}));
vi.mock('./env.service', () => ({
  default: { getVariable: vi.fn().mockReturnValue('https://send.api') },
}));

const now = new Date('2026-01-01T00:00:00Z');
const tokenResponse = (token: string, expiresInSeconds: number) => ({
  data: { user: 'network-token', token, bucketId: 'send-bucket-id', expiresIn: expiresInSeconds },
});
const twoHours = 2 * 60 * 60;

describe('Network credentials', () => {
  let getNetworkCredentials: typeof import('./network-credentials.service').getNetworkCredentials;
  let withNetworkCredentials: typeof import('./network-credentials.service').withNetworkCredentials;

  beforeEach(async () => {
    vi.useFakeTimers().setSystemTime(now);
    vi.stubGlobal('window', { grecaptcha: { ready: (cb: () => void) => cb() } });
    vi.mocked(axios.post).mockReset();
    vi.resetModules();
    ({ getNetworkCredentials, withNetworkCredentials } = await import('./network-credentials.service'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  test('When credentials are requested, then the temporary token is used as the network password', async () => {
    vi.mocked(axios.post).mockResolvedValueOnce(tokenResponse('network-jwt', twoHours));

    const credentials = await getNetworkCredentials();

    expect(axios.post).toHaveBeenCalledWith(
      'https://send.api/links/network-token',
      {},
      { headers: { 'x-internxt-captcha': 'captcha-token' } },
    );
    expect(credentials).toStrictEqual({ bucketId: 'send-bucket-id', user: 'network-token', pass: 'network-jwt' });
  });

  test('When the token is still valid, then it is reused', async () => {
    vi.mocked(axios.post).mockResolvedValueOnce(tokenResponse('network-jwt', twoHours));

    await getNetworkCredentials();
    const credentials = await getNetworkCredentials();

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(credentials.pass).toBe('network-jwt');
  });

  test('When the token expires in less than an hour, then a new one is requested', async () => {
    vi.mocked(axios.post)
      .mockResolvedValueOnce(tokenResponse('old-jwt', 59 * 60))
      .mockResolvedValueOnce(tokenResponse('new-jwt', twoHours));

    await getNetworkCredentials();
    const credentials = await getNetworkCredentials();

    expect(axios.post).toHaveBeenCalledTimes(2);
    expect(credentials.pass).toBe('new-jwt');
  });

  test('When several requests happen at the same time, then only one token is requested', async () => {
    vi.mocked(axios.post).mockResolvedValueOnce(tokenResponse('network-jwt', twoHours));

    await Promise.all([getNetworkCredentials(), getNetworkCredentials(), getNetworkCredentials()]);

    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  test('When the network rejects the token, then the operation is retried once with a new token', async () => {
    vi.mocked(axios.post)
      .mockResolvedValueOnce(tokenResponse('rejected-jwt', twoHours))
      .mockResolvedValueOnce(tokenResponse('new-jwt', twoHours));
    const operation = vi
      .fn()
      .mockRejectedValueOnce(Object.assign(new Error('Unauthorized'), { status: 401 }))
      .mockResolvedValueOnce('done');

    const result = await withNetworkCredentials(operation);

    expect(result).toBe('done');
    expect(operation).toHaveBeenCalledTimes(2);
    expect(operation).toHaveBeenLastCalledWith(expect.objectContaining({ pass: 'new-jwt' }));
  });

  test('When the operation fails for another reason, then it is not retried', async () => {
    vi.mocked(axios.post).mockResolvedValueOnce(tokenResponse('network-jwt', twoHours));
    const error = Object.assign(new Error('Server error'), { status: 500 });
    const operation = vi.fn().mockRejectedValue(error);

    await expect(withNetworkCredentials(operation)).rejects.toBe(error);

    expect(operation).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledTimes(1);
  });
});

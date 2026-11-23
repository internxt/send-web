import { SdkManager } from './sdk-manager.service';
import { getCaptchaToken } from '../lib/auth';

const RENEW_MARGIN_MS = 60 * 60 * 1000;

export interface NetworkCredentials {
  bucketId: string;
  user: string;
  pass: string;
}

let cached: { credentials: NetworkCredentials; expiresAt: number } | null = null;
let pending: Promise<NetworkCredentials> | null = null;

async function requestCredentials(): Promise<NetworkCredentials> {
  const captcha = await getCaptchaToken();
  const data = await SdkManager.instance.getSend({ 'x-internxt-captcha': captcha }).getNetworkToken();

  const credentials = { bucketId: data.bucketId, user: data.user, pass: data.token };
  cached = { credentials, expiresAt: Date.now() + data.expiresIn * 1000 };

  return credentials;
}

export async function getNetworkCredentials(): Promise<NetworkCredentials> {
  if (cached && cached.expiresAt - RENEW_MARGIN_MS > Date.now()) {
    return cached.credentials;
  }

  if (!pending) {
    pending = requestCredentials().finally(() => {
      pending = null;
    });
  }

  return pending;
}

import axios from 'axios';
import envService from './env.service';
import { getCaptchaToken } from '../lib/auth';

const RENEW_MARGIN_MS = 60 * 60 * 1000;

export interface NetworkCredentials {
  bucketId: string;
  user: string;
  pass: string;
}

interface NetworkTokenResponse {
  user: string;
  token: string;
  bucketId: string;
  expiresIn: number;
}

let cached: { credentials: NetworkCredentials; expiresAt: number } | null = null;
let pending: Promise<NetworkCredentials> | null = null;

async function requestCredentials(): Promise<NetworkCredentials> {
  const captcha = await getCaptchaToken();

  const { data } = await axios.post<NetworkTokenResponse>(
    `${envService.getVariable('sendApiUrl')}/links/network-token`,
    {},
    { headers: { 'x-internxt-captcha': captcha } },
  );

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

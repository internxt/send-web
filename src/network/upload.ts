import { Network } from '@internxt/sdk/dist/network';
import { ErrorWithContext } from '@internxt/sdk/dist/network/errors';

import { getSha256 } from './crypto';
import { NetworkFacade } from './NetworkFacade';
import { reportError } from '../services/error-reporting.service';
import axios, { AxiosError, AxiosProgressEvent } from 'axios';
import envService from '../services/env.service';
import packageJson from '../../package.json';

export type UploadProgressCallback = (totalBytes: number, uploadedBytes: number) => void;

interface NetworkCredentials {
  user: string;
  pass: string;
}

interface IUploadParams {
  filesize: number;
  filecontent: File;
  creds: NetworkCredentials;
  mnemonic: string;
  progressCallback: UploadProgressCallback;
  abortController?: AbortController;
  parts?: number;
}

export async function uploadFileUint8Array(
  content: Uint8Array,
  url: string,
  opts: {
    progressCallback: UploadProgressCallback;
    abortController?: AbortController;
  },
): Promise<{ etag: string | undefined }> {
  try {
    const res = await axios.create()({
      url,
      method: 'PUT',
      data: content,
      headers: {
        'content-type': 'application/octet-stream',
      },
      onUploadProgress: (progress: AxiosProgressEvent) => {
        opts.progressCallback(progress.total ?? 0, progress.loaded);
      },
      signal: opts.abortController?.signal,
    });

    return { etag: res.headers.etag };
  } catch (err) {
    const error = err as AxiosError;

    if (axios.isCancel(error)) {
      throw new Error('Upload aborted');
    } else if ((error as AxiosError).response && (error as AxiosError)?.response?.status === 403) {
      throw new Error('Request has expired');
    } else if ((error as AxiosError).message === 'Network Error') {
      throw error;
    } else {
      throw new Error('Unknown error');
    }
  }
}

async function getAuthFromCredentials(creds: NetworkCredentials): Promise<{
  username: string;
  password: string;
}> {
  return {
    username: creds.user,
    password: await getSha256(creds.pass),
  };
}

export async function uploadFile(bucketId: string, params: IUploadParams): Promise<string> {
  const file: File = params.filecontent;

  const auth = await getAuthFromCredentials({
    user: params.creds.user,
    pass: params.creds.pass,
  });

  const facade = new NetworkFacade(
    Network.client(
      envService.getVariable('networkUrl'),
      {
        clientName: packageJson.name,
        clientVersion: packageJson.version,
      },
      {
        bridgeUser: auth.username,
        userId: auth.password,
      },
    ),
  );

  if (params.parts) {
    return facade
      .uploadMultipart(bucketId, params.mnemonic, file, {
        uploadingCallback: params.progressCallback,
        abortController: params.abortController,
        parts: params.parts,
      })
      .catch((err: ErrorWithContext) => {
        reportError(err, err.context);
        throw err;
      });
  }

  return facade
    .upload(bucketId, params.mnemonic, file, {
      uploadingCallback: params.progressCallback,
      abortController: params.abortController,
    })
    .catch((err: ErrorWithContext) => {
      reportError(err, err.context);

      throw err;
    });
}

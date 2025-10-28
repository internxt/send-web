import { Network } from '@internxt/sdk/dist/network';
import { Decipher } from 'crypto';
import * as Sentry from '@sentry/react';

import { sha256 } from './crypto';
import { NetworkFacade } from './NetworkFacade';
import { Abortable } from './requests';
import { joinReadableBinaryStreams } from './streams';
import envService from '../services/env.service';

export type DownloadProgressCallback = (totalBytes: number, downloadedBytes: number) => void;
export type Downloadable = { fileId: string; bucketId: string };

export function loadWritableStreamPonyfill(): Promise<void> {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/web-streams-polyfill@2.0.2/dist/ponyfill.min.js';
  document.head.appendChild(script);

  return new Promise((resolve) => {
    script.onload = function () {
      resolve();
    };
  });
}

type BinaryStream = ReadableStream<Uint8Array>;

export async function binaryStreamToBlob(stream: BinaryStream): Promise<Blob> {
  const reader = stream.getReader();
  const slices: Uint8Array[] = [];

  let finish = false;

  while (!finish) {
    const { done, value } = await reader.read();

    if (!done) {
      slices.push(value as Uint8Array);
    }

    finish = done;
  }

  return new Blob(slices);
}

interface FileInfo {
  bucket: string;
  mimetype: string;
  filename: string;
  frame: string;
  size: number;
  id: string;
  created: Date;
  hmac: {
    value: string;
    type: string;
  };
  erasure?: {
    type: string;
  };
  index: string;
}

export function getDecryptedStream(
  encryptedContentSlices: ReadableStream<Uint8Array>[],
  decipher: Decipher,
): ReadableStream<Uint8Array> {
  const encryptedStream = joinReadableBinaryStreams(encryptedContentSlices);

  let keepReading = true;

  const decryptedStream = new ReadableStream({
    async pull(controller) {
      if (!keepReading) return;

      const reader = encryptedStream.getReader();
      const status = await reader.read();

      if (status.done) {
        controller.close();
      } else {
        controller.enqueue(decipher.update(status.value));
      }

      reader.releaseLock();
    },
    cancel() {
      keepReading = false;
    },
  });

  return decryptedStream;
}

async function getFileDownloadStream(
  downloadUrls: string[],
  decipher: Decipher,
  abortController?: AbortController,
): Promise<ReadableStream> {
  const encryptedContentParts: ReadableStream<Uint8Array>[] = [];

  for (const downloadUrl of downloadUrls) {
    const encryptedStream = await fetch(downloadUrl, { signal: abortController?.signal }).then((res) => {
      if (!res.body) {
        throw new Error('No content received');
      }

      return res.body;
    });

    encryptedContentParts.push(encryptedStream);
  }

  return getDecryptedStream(encryptedContentParts, decipher);
}

interface NetworkCredentials {
  user: string;
  pass: string;
}

interface IDownloadParams {
  bucketId: string;
  fileId: string;
  creds?: NetworkCredentials;
  mnemonic?: string;
  encryptionKey?: Buffer;
  token?: string;
  options?: {
    notifyProgress: DownloadProgressCallback;
    abortController?: AbortController;
  };
}

type FileStream = ReadableStream<Uint8Array>;
type DownloadFileResponse = Promise<FileStream>;
type DownloadFileOptions = { notifyProgress: DownloadProgressCallback, abortController?: AbortController };
interface NetworkCredentials {
  user: string;
  pass: string;
}

interface DownloadFileParams {
  bucketId: string
  fileId: string
  options?: DownloadFileOptions
}

interface DownloadOwnFileParams extends DownloadFileParams {
  creds: NetworkCredentials
  mnemonic: string
  token?: never
  encryptionKey?: never
}

interface DownloadSharedFileParams extends DownloadFileParams {
  creds?: never
  mnemonic?: never
  token: string
  encryptionKey: string
}

type DownloadSharedFileFunction = (params: DownloadSharedFileParams) => DownloadFileResponse;
type DownloadOwnFileFunction = (params: DownloadOwnFileParams) => DownloadFileResponse;
type DownloadFileFunction = (params: DownloadSharedFileParams | DownloadOwnFileParams) => DownloadFileResponse;

const downloadSharedFile: DownloadSharedFileFunction = (params) => {
  const { bucketId, fileId, encryptionKey, token, options } = params;

  return new NetworkFacade(
    Network.client(
      process.env.REACT_APP_NETWORK_URL as string,
      {
        clientName: 'drive-web',
        clientVersion: '1.0'
      },
      {
        bridgeUser: '',
        userId: ''
      }
    )
  ).download(bucketId, fileId, '', {
    key: Buffer.from(encryptionKey, 'hex'),
    token,
    downloadingCallback: options?.notifyProgress,
    abortController: options?.abortController
  });
};

function getAuthFromCredentials(creds: NetworkCredentials): { username: string, password: string } {
  return {
    username: creds.user,
    password: sha256(Buffer.from(creds.pass)).toString('hex'),
  };
}

const downloadOwnFile: DownloadOwnFileFunction = (params) => {
  const { bucketId, fileId, mnemonic, options } = params;
  const auth = getAuthFromCredentials(params.creds);

  return new NetworkFacade(
    Network.client(
      envService.getVariable("networkUrl"),
      {
        clientName: 'drive-web',
        clientVersion: '1.0'
      },
      {
        bridgeUser: auth.username,
        userId: auth.password
      }
    )
  ).download(bucketId, fileId, mnemonic, {
    downloadingCallback: options?.notifyProgress,
    abortController: options?.abortController
  });
};

const downloadFile: DownloadFileFunction = (params) => {
  if (params.token && params.encryptionKey) {
    return downloadSharedFile(params);
  } else if (params.creds && params.mnemonic) {
    return downloadOwnFile(params);
  } else {
    throw new Error('DOWNLOAD ERRNO. 0');
  }
};

export default downloadFile;

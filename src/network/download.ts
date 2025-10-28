import { Network } from '@internxt/sdk/dist/network';
import { Decipheriv } from 'crypto';

import { getSha256 } from './crypto';
import { NetworkFacade } from './NetworkFacade';
import { joinReadableBinaryStreams } from './streams';
import envService from '../services/env.service';
import packageJson from '../../package.json';

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
  const slices: BlobPart[] = [];

  let finish = false;

  while (!finish) {
    const { done, value } = await reader.read();

    if (!done) {
      slices.push(value as Uint8Array<ArrayBuffer>);
    }

    finish = done;
  }

  return new Blob(slices);
}

export function getDecryptedStream(
  encryptedContentSlices: ReadableStream<Uint8Array>[],
  decipher: Decipheriv,
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

interface NetworkCredentials {
  user: string;
  pass: string;
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

type DownloadOwnFileFunction = (params: DownloadOwnFileParams) => DownloadFileResponse;
type DownloadFileFunction = (params: DownloadSharedFileParams | DownloadOwnFileParams) => DownloadFileResponse;


async function getAuthFromCredentials(creds: NetworkCredentials): Promise<{ username: string, password: string }> {
  return {
    username: creds.user,
    password: await getSha256(creds.pass),
  };
}

const downloadOwnFile: DownloadOwnFileFunction = async (params) => {
  const { bucketId, fileId, mnemonic, options } = params;
  const auth = await getAuthFromCredentials(params.creds);

  return new NetworkFacade(
    Network.client(
      envService.getVariable("networkUrl"),
      {
        clientName: packageJson.name,
        clientVersion: packageJson.version
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
  if (params.creds && params.mnemonic) {
    return downloadOwnFile(params);
  } else {
    throw new Error('DOWNLOAD ERRNO. 0');
  }
};

export default downloadFile;

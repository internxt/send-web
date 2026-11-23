import downloadFile from '../network/download';
import { uploadFile } from '../network/upload';
import { aes } from '@internxt/lib';
import { SendItem } from '../models/SendItem';
import envService from './env.service';
import { getNetworkCredentials } from './network-credentials.service';

export type ProgressOptions = {
  totalBytes?: number;
  progress?: (totalBytes: number, downloadedBytes: number) => void;
  abortController?: AbortController;
  plainCode?: string;
};

/**
 * This service has *the only responsability* of providing access
 * to the content of Send ites, knowing how Send is using the Internxt's
 * Network and how the zero-knowledge is being implemented.
 */
export class NetworkService {
  public static getInstance(): NetworkService {
    return new NetworkService();
  }

  /**
   * Downloads a Send item using the decrypting protocol version 1.
   */
  async getDownloadFileStreamV1(
    item: SendItem,
    encryptedCode: string,
    opts?: ProgressOptions,
  ): Promise<ReadableStream> {
    const plainCode = aes.decrypt(encryptedCode, this.encryptionKey);

    const { bucketId, user, pass } = await getNetworkCredentials();

    return downloadFile({
      bucketId,
      fileId: item.networkId,
      creds: { user, pass },
      mnemonic: aes.decrypt(item.encryptionKey, plainCode),
      options: {
        notifyProgress: (totalBytes, downloadedBytes) => {
          opts?.progress?.(opts.totalBytes || totalBytes, downloadedBytes);
        },
        abortController: opts?.abortController,
      },
    });
  }

  /**
   * Downloads a Send item using the decrypting protocol version 2.
   */
  async getDownloadFileStreamV2(item: SendItem, plainCode: string, opts?: ProgressOptions): Promise<ReadableStream> {
    const encryptionKey = aes.decrypt(item.encryptionKey, plainCode);

    const { bucketId, user, pass } = await getNetworkCredentials();

    return downloadFile({
      bucketId,
      fileId: item.networkId,
      creds: { user, pass },
      mnemonic: encryptionKey,
      options: {
        notifyProgress: (totalBytes, downloadedBytes) => {
          opts?.progress?.(opts.totalBytes || totalBytes, downloadedBytes);
        },
        abortController: opts?.abortController,
      },
    });
  }

  public getDownloadFileStream(
    item: SendItem,
    code: string,
    opts?: ProgressOptions & { customEncryptionKey?: string },
  ): Promise<ReadableStream> {
    const requiresVersionTwoDecryption = item.version === 2;

    if (requiresVersionTwoDecryption) {
      return this.getDownloadFileStreamV2(item, code, opts);
    } else {
      return this.getDownloadFileStreamV1(item, code, opts);
    }
  }

  get encryptionKey(): string {
    return envService.getVariable('sendEncryptionKey');
  }

  async uploadFile(
    file: File,
    opts?: {
      progress?: (totalBytes: number, downloadedBytes: number) => void;
      abortController?: AbortController;
    },
  ): Promise<string> {
    let parts;
    const partSize = 50 * 1024 * 1024;
    const minimumMultipartThreshold = 100 * 1024 * 1024;

    if (file.size > minimumMultipartThreshold) {
      parts = Math.ceil(file.size / partSize);
    }

    const { bucketId, user, pass } = await getNetworkCredentials();

    return uploadFile(bucketId, {
      creds: { user, pass },
      filecontent: file,
      filesize: file.size,
      mnemonic: this.encryptionKey,
      progressCallback: (totalBytes, uploadedBytes) => {
        opts?.progress?.(totalBytes, uploadedBytes);
      },
      parts,
      abortController: opts?.abortController,
    });
  }
}

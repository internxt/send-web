import downloadFile from '../network/download';
import { uploadFile } from '../network/upload';
import { aes } from '@internxt/lib';
import { SendItem } from '../models/SendItem';
import envService from './env.service';

interface NetworkCredentials {
  user: string;
  pass: string;
}

function getSendAccountParameters(): {
  bucketId: string;
  user: string;
  pass: string;
  encryptionKey: string;
} {
  return {
    bucketId: envService.getVariable('sendBucketId'),
    user: envService.getVariable('sendUser'),
    pass: envService.getVariable('sendPass'),
    encryptionKey: envService.getVariable('sendEncryptionKey'),
  };
}

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
  private constructor(private readonly creds: NetworkCredentials) {}
  public static getInstance(): NetworkService {
    const accountParams = getSendAccountParameters();

    return new NetworkService({
      user: accountParams.user,
      pass: accountParams.pass,
    });
  }

  /**
   * Downloads a Send item using the decrypting protocol version 1.
   */
  getDownloadFileStreamV1(item: SendItem, encryptedCode: string, opts?: ProgressOptions): Promise<ReadableStream> {
    const { bucketId, encryptionKey } = getSendAccountParameters();
    const plainCode = aes.decrypt(encryptedCode, encryptionKey);

    return downloadFile({
      bucketId,
      fileId: item.networkId,
      creds: this.creds,
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
  getDownloadFileStreamV2(item: SendItem, plainCode: string, opts?: ProgressOptions): Promise<ReadableStream> {
    const { bucketId } = getSendAccountParameters();
    const encryptionKey = aes.decrypt(item.encryptionKey, plainCode);

    return downloadFile({
      bucketId,
      fileId: item.networkId,
      creds: this.creds,
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
    const { bucketId, user, pass, encryptionKey } = getSendAccountParameters();

    let parts;
    const partSize = 50 * 1024 * 1024;
    const minimumMultipartThreshold = 100 * 1024 * 1024;

    if (file.size > minimumMultipartThreshold) {
      parts = Math.ceil(file.size / partSize);
    }

    return uploadFile(bucketId, {
      creds: { user, pass },
      filecontent: file,
      filesize: file.size,
      mnemonic: encryptionKey,
      progressCallback: (totalBytes, uploadedBytes) => {
        opts?.progress?.(totalBytes, uploadedBytes);
      },
      parts,
      abortController: opts?.abortController,
    });
  }
}

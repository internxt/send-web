import downloadFile from "../network/download";
import { uploadFile } from "../network/upload";
import axios, { AxiosRequestConfig } from 'axios';
import { createHash } from 'crypto';
import { aes } from "@internxt/lib";
import { SendItem } from "../models/SendItem";

interface NetworkCredentials {
  user: string;
  pass: string;
}

function getSendAccountParameters(): {
  bucketId: string,
  user: string,
  pass: string,
  encryptionKey: string
} {
  return {
    bucketId: process.env.REACT_APP_SEND_BUCKET_ID,
    user: process.env.REACT_APP_SEND_USER,
    pass: process.env.REACT_APP_SEND_PASS,
    encryptionKey: process.env.REACT_APP_SEND_ENCRYPTION_KEY
  }
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
  private constructor(private readonly creds: NetworkCredentials) { }
  public static getInstance(): NetworkService {
    const accountParams = getSendAccountParameters();

    return new NetworkService({
      user: accountParams.user,
      pass: accountParams.pass
    });
  }

  /**
   * Downloads a Send item using the decrypting protocol version 1.
   */
  getDownloadFileStreamV1(
    item: SendItem,
    encryptedCode: string,
    opts?: ProgressOptions
  ): Promise<ReadableStream> {
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
        abortController: opts?.abortController
      }
    });
  }

  /**
   * Downloads a Send item using the decrypting protocol version 2.
   */
  getDownloadFileStreamV2(
    item: SendItem,
    plainCode: string,
    opts?: ProgressOptions
  ): Promise<ReadableStream> {
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
        abortController: opts?.abortController
      }
    });
  }

  public getDownloadFileStream(
    item: SendItem,
    code: string,
    opts?: ProgressOptions & { customEncryptionKey?: string }
  ): Promise<ReadableStream> {
    const requiresVersionTwoDecryption = item.version === 2;

    if (requiresVersionTwoDecryption) {
      return this.getDownloadFileStreamV2(
        item,
        code,
        opts
      );
    } else {
      return this.getDownloadFileStreamV1(
        item,
        code,
        opts
      );
    }
  }

  get encryptionKey(): string {
    return process.env.REACT_APP_SEND_ENCRYPTION_KEY;
  }

  async uploadFile(
    file: File,
    opts?: {
      progress?: (totalBytes: number, downloadedBytes: number) => void,
      abortController?: AbortController
    }
  ): Promise<string> {
    const { bucketId, user, pass, encryptionKey } = getSendAccountParameters();

    let parts
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
      abortController: opts?.abortController
    });
  }

  async getShareToken(): Promise<string> {
    // TODO: Move to SDK
    const bucketId = process.env.REACT_APP_SEND_BUCKET_ID;
    const operation = 'PULL';
    const requestUrl = `${process.env.REACT_APP_NETWORK_URL}/buckets/${bucketId}/tokens`;

    function sha256(input: Buffer): Buffer {
      return createHash('sha256').update(input).digest();
    }

    const opts: AxiosRequestConfig = {
      method: 'POST',
      auth: {
        username: process.env.REACT_APP_SEND_USER,
        password: sha256(Buffer.from(process.env.REACT_APP_SEND_PASS)).toString('hex'),
      },
      url: requestUrl,
      data: { operation }
    };

    const res = await axios.request<{
      bucket: string
      encryptionKey: string,
      id: string,
      operation: 'PULL',
      token: string;
    }>(opts);

    return res.data.token;
  }

  async uploadFileForShare(
    file: File,
    opts?: {
      progress?: (totalBytes: number, downloadedBytes: number) => void,
      abortController?: AbortController
    }
  ): Promise<string> {
    const { bucketId, user, pass, encryptionKey } = getSendAccountParameters();

    let parts
    const partSize = 100 * 1024 * 1024;
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
      abortController: opts?.abortController
    });
  }
}

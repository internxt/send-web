import downloadFile from "../network/download";
import { uploadFile } from "../network/upload";

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

export class NetworkService {
  private constructor(private readonly creds: NetworkCredentials) {}
  public static getInstance(): NetworkService {
    const accountParams = getSendAccountParameters();

    return new NetworkService({
      user: accountParams.user,
      pass: accountParams.pass
    });
  }

  public getDownloadFileStream(
    fileId: string,
    opts?: {
      progress?: (totalBytes: number, downloadedBytes: number) => void,
      abortController?: AbortController
    }
  ): Promise<ReadableStream> {
    const { bucketId, encryptionKey } = getSendAccountParameters();

    return downloadFile({
      bucketId,
      fileId,
      creds: this.creds,
      mnemonic: encryptionKey,
      options: {
        notifyProgress: (totalBytes, downloadedBytes) => {
          opts?.progress?.(totalBytes, downloadedBytes);
        },
        abortController: opts?.abortController
      }
    });
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
    const partSize = 100*1024*1024;
    const minimumMultipartThreshold = 100*1024*1024;

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

import downloadFile from "../network/download";

interface NetworkCredentials {
  user: string;
  pass: string;
}

export class NetworkService {
  private constructor(private readonly creds: NetworkCredentials) {}
  public static getInstance(): NetworkService {
    return new NetworkService({
      user: process.env.REACT_APP_SEND_USER,
      pass: process.env.REACT_APP_SEND_PASS
    });
  }

  public getDownloadFileStream(fileId: string): Promise<ReadableStream> {
    return downloadFile({
      bucketId: process.env.REACT_APP_SEND_BUCKET_ID,
      fileId,
      creds: this.creds,
      mnemonic: process.env.REACT_APP_SEND_ENCRYPTION_KEY,
      options: {
        notifyProgress: (total, downloaded) => {
          console.log('PROGRESS', downloaded / total);
        },
      }
    });
  }
}

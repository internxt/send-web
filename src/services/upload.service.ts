import { randomBytes } from "crypto";
import { NetworkService } from "./network.service";

export class UploadService {
  private static UPLOAD_SIZE_LIMIT = 5 * 1024 * 1024 * 1024;

  static async uploadFiles(
    files: File[], 
    progress: (totalBytes: number, uploadedBytes: number) => void
  ): Promise<string[]> {
    console.log(files);
    const totalBytes = files.reduce((a, f) => a+f.size, 0);
    if (totalBytes > this.UPLOAD_SIZE_LIMIT) {
      throw new Error('Maximum allowed total upload size is '+ this.UPLOAD_SIZE_LIMIT);
    }

    const uploadsProgress: Record<string,number> = {};
    const progressInterval = setInterval(() => {
      const uploadedBytes = Object.values(uploadsProgress).reduce((a, p) => a+p, 0);

      progress(totalBytes, uploadedBytes);
    }, 500);

    try {
      const networkIds: string[] = [];
      const networkService = NetworkService.getInstance();

      for (const file of files) {
        const uploadId = randomBytes(10).toString('hex');
        uploadsProgress[uploadId] = 0;

        const networkId = await networkService.uploadFile(file, (_, uploadedBytes) => {
          uploadsProgress[uploadId] = uploadedBytes;
        });

        networkIds.push(networkId);
      }

      // TODO: POST this to Send server (+ bucket token)
      return networkIds;
    } finally {
      clearInterval(progressInterval);
    }
  }
}

import { randomBytes } from "crypto";
import { queue, QueueObject } from 'async';

import { NetworkService } from "./network.service";

enum FileSizeType {
  Big = 'big',
  Medium = 'medium',
  Small = 'small'
}

const oneHundredMbytes = 100 * 1024 * 1024;
const twentyMbytes = 20 * 1024 * 1024;

export class UploadService {
  private static UPLOAD_SIZE_LIMIT = 5 * 1024 * 1024 * 1024;

  static async uploadFiles(
    files: File[], 
    opts?: {
      progress?: (totalBytes: number, uploadedBytes: number) => void,
      abortController?: AbortController
    }
  ): Promise<string[]> {
    console.log(files);
    const totalBytes = files.reduce((a, f) => a+f.size, 0);
    if (totalBytes > this.UPLOAD_SIZE_LIMIT) {
      throw new Error('Maximum allowed total upload size is '+ this.UPLOAD_SIZE_LIMIT);
    }


    const uploadManager = new UploadManager(files, opts?.abortController);
    const networkIds = await uploadManager.run(opts?.progress);

    // TODO: POST this to Send server (+ bucket token)
    return networkIds;
  }
}

class UploadManager {
  private filesGroups: Record<FileSizeType, { 
    upperBound: number, 
    lowerBound: number,
    concurrency: number
  }> = {
    [FileSizeType.Big]: {
      upperBound: Infinity,
      lowerBound: oneHundredMbytes,
      concurrency: 1
    },
    [FileSizeType.Medium]: {
      upperBound: oneHundredMbytes - 1,
      lowerBound: twentyMbytes,
      concurrency: 3
    },
    [FileSizeType.Small]: {
      upperBound: twentyMbytes - 1,
      lowerBound: 1,
      concurrency: 6
    }
  }

  private uploadsProgress: Record<string, number> = {};

  private uploadQueue: QueueObject<File> = queue<File>((
    file, 
    next: (err: Error | null, networkId?: string) => void
  ) => {
    const networkService = NetworkService.getInstance();
    const uploadId = randomBytes(10).toString('hex');

    this.uploadsProgress[uploadId] = 0;

    networkService.uploadFile(file, {
      abortController: this.abortController,
      progress: (_, uploadedBytes) => {
        this.uploadsProgress[uploadId] = uploadedBytes;
      }
    }).then((networkId) => {      
      next(null, networkId);
    }).catch((err) => {
      next(err);
    });
  }, this.filesGroups.small.concurrency);

  private abortController?: AbortController;
  private files: File[];

  constructor(files: File[], abortController?: AbortController) {
    this.files = files;
    this.abortController = abortController;
  }

  private classifyFilesBySize(files: File[]): [File[], File[], File[]] {
    return [
      files.filter((f) => f.size >= this.filesGroups.big.lowerBound),
      files.filter((f) => f.size >= this.filesGroups.medium.lowerBound && f.size <= this.filesGroups.medium.upperBound),
      files.filter((f) => f.size >= this.filesGroups.small.lowerBound && f.size <= this.filesGroups.small.upperBound)
    ];
  }

  async run(progress?: (totalBytes: number, uploadedBytes: number) => void): Promise<string[]> {
    const totalBytes = this.files.reduce((a, f) => a + f.size, 0);
    const progressInterval = setInterval(() => {
      const uploadedBytes = Object.values(this.uploadsProgress).reduce((a, p) => a+p, 0);

      progress?.(totalBytes, uploadedBytes);
    }, 500);

    try {
      const [bigSizedFiles, mediumSizedFiles, smallSizedFiles] = this.classifyFilesBySize(this.files);
      const networkIds: string[] = [];
  
      const uploadFiles = async (files: File[], concurrency: number) => {
        this.uploadQueue.concurrency = concurrency;
  
        const uploadPromises: Promise<string>[] = await this.uploadQueue.pushAsync(files);
  
        const networkIdsChunk = await Promise.all(uploadPromises);
  
        networkIds.push(...networkIdsChunk);
      };
  
      if (smallSizedFiles.length > 0)
        await uploadFiles(smallSizedFiles, this.filesGroups.small.concurrency);
  
      if (mediumSizedFiles.length > 0)
        await uploadFiles(mediumSizedFiles, this.filesGroups.medium.concurrency);
  
      if (bigSizedFiles.length > 0)
        await uploadFiles(bigSizedFiles, this.filesGroups.big.concurrency);
  
      return networkIds;
    } finally {
      clearInterval(progressInterval);
    }   
  }
}
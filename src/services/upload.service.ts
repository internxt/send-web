import { randomBytes } from "crypto";
import { queue, QueueObject } from 'async';
import axios from 'axios';
import { aes } from '@internxt/lib';

import { NetworkService } from "./network.service";

interface FileWithNetworkId extends File {
  networkId: string
}

enum FileSizeType {
  Big = 'big',
  Medium = 'medium',
  Small = 'small'
}

const oneHundredMbytes = 100 * 1024 * 1024;
const twentyMbytes = 20 * 1024 * 1024;

export class UploadService {
  private static UPLOAD_SIZE_LIMIT = 5 * 1024 * 1024 * 1024;

  static async uploadFilesAndGetLink(
    files: File[], 
    opts?: {
      progress?: (totalBytes: number, uploadedBytes: number) => void,
      abortController?: AbortController
    }
  ): Promise<string> {
    const createSendLinksPayload = await UploadService.uploadFiles(files, opts);
    const createSendLinkResponse = await storeSendLinks(createSendLinksPayload);

    return window.origin + '/' + createSendLinkResponse.id;
  }

  static async uploadFiles(
    files: File[], 
    opts?: {
      progress?: (totalBytes: number, uploadedBytes: number) => void,
      abortController?: AbortController
    }
  ): Promise<CreateSendLinksPayload> {
    console.log(files);
    const totalBytes = files.reduce((a, f) => a+f.size, 0);
    if (totalBytes > this.UPLOAD_SIZE_LIMIT) {
      throw new Error('Maximum allowed total upload size is '+ this.UPLOAD_SIZE_LIMIT);
    }

    const networkToken = await NetworkService.getInstance().getShareToken();

    const uploadManager = new UploadManager(files, opts?.abortController);    
    return uploadManager.run(opts?.progress);
  }
}

class UploadManager {
  private networkService = NetworkService.getInstance();
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

  private errored = false;
  private uploadsProgress: Record<string, number> = {};
  private uploadQueue: QueueObject<File> = queue<File>((
    file, 
    next: (err: Error | null, res?: Pick<File, 'name' | 'size'> & { networkId: string }) => void
  ) => {
    const networkService = this.networkService;
    const uploadId = randomBytes(10).toString('hex');

    this.uploadsProgress[uploadId] = 0;

    networkService.uploadFile(file, {
      abortController: this.abortController,
      progress: (_, uploadedBytes) => {
        this.uploadsProgress[uploadId] = uploadedBytes;
      }
    }).then((networkId) => {      
      next(null, { 
        name: file.name,
        size: file.size, 
        networkId
      });
    }).catch((err) => {
      if (!this.errored) {
        this.uploadQueue.kill();
      }

      this.errored = true;

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

  async run(progress?: (totalBytes: number, uploadedBytes: number) => void): Promise<CreateSendLinksPayload> {
    const totalBytes = this.files.reduce((a, f) => a + f.size, 0);
    const progressInterval = setInterval(() => {
      const uploadedBytes = Object.values(this.uploadsProgress).reduce((a, p) => a+p, 0);

      progress?.(totalBytes, uploadedBytes);
    }, 500);

    try {
      const [bigSizedFiles, mediumSizedFiles, smallSizedFiles] = this.classifyFilesBySize(this.files);
      const filesReferences: SendLink[] = [];
      const code = randomBytes(32).toString('hex');
  
      const uploadFiles = async (files: File[], concurrency: number) => {
        this.uploadQueue.concurrency = concurrency;

        const uploadPromises: Promise<FileWithNetworkId>[] = await this.uploadQueue.pushAsync(files);
        const uploadedFiles = await Promise.all(uploadPromises);

        for (const uploadedFile of uploadedFiles) { 
          const encryptionKey = aes.encrypt(this.networkService.encryptionKey, code);

          filesReferences.push({
            encryptionKey,
            name: uploadedFile.name,
            networkId: uploadedFile.networkId,
            size: uploadedFile.size,
            type: 'file'
          });
        }      
      };
  
      if (smallSizedFiles.length > 0)
        await uploadFiles(smallSizedFiles, this.filesGroups.small.concurrency);
  
      if (mediumSizedFiles.length > 0)
        await uploadFiles(mediumSizedFiles, this.filesGroups.medium.concurrency);
  
      if (bigSizedFiles.length > 0)
        await uploadFiles(bigSizedFiles, this.filesGroups.big.concurrency);

      
      return {
        code,
        items: filesReferences,
        receivers: [],
        sender: 'hello@internxt.com',
        subject: 'test',
        title: 'test'
      };
    } finally {
      clearInterval(progressInterval);
    }   
  }
}

/**
 * TODO: SDK
 */
interface SendLink {
  name: string, 
  type: 'file', 
  size: number, 
  networkId: string, 
  encryptionKey: string 
}

interface CreateSendLinksPayload {
  sender: string
  receivers: string[]
  code: string
  title: string
  subject: string
  items: SendLink[]
}

interface CreateSendLinksResponse {
  id: string,
  title: string
  subject: string
  code: string
  sender: string
  receivers: string[]
  views: number
  userId: number
  items: SendLink[]
  createdAt: string
  updatedAt: string
  expirationAt: string
}

async function storeSendLinks(payload: CreateSendLinksPayload) {
  const res = await axios.post<CreateSendLinksResponse>(process.env.REACT_APP_API_URL + '/api/links', payload);

  return res.data;
} 

import { randomBytes } from 'crypto';
import { queue, QueueObject } from 'async';
import { generateMnemonic } from 'bip39';
import { aes, stringUtils } from '@internxt/lib';

import { MAX_ITEMS_PER_LINK, MAX_BYTES_PER_SEND } from '../constants';
import { NetworkService } from './network.service';
import { SendItemData } from '../models/SendItem';
import { getCaptchaToken } from '../lib/auth';
import { CreateSendLinksPayload, SendLink } from '@internxt/sdk/dist/send/types';
import { SdkManager } from './sdk-manager.service';

interface FileWithNetworkId extends File {
  networkId: string;
}

enum FileSizeType {
  Big = 'big',
  Medium = 'medium',
  Small = 'small',
}

const oneHundredMbytes = 100 * 1024 * 1024;
const twentyMbytes = 20 * 1024 * 1024;

interface EmailInfo {
  sender: string;
  title: string;
  receivers: string[];
  subject: string;
}

export class MaximumItemsNumberLimitReachedError extends Error {
  constructor() {
    super('Maximum allowed files to upload is ' + MAX_ITEMS_PER_LINK);
  }
}

interface SendLinkWithFile extends SendLink {
  file: FileWithNetworkId;
}

const originUrl = window.origin;
export class UploadService {
  static async storeSendLinks(payload: CreateSendLinksPayload) {
    const token = await getCaptchaToken();
    const customHeaders = {
      'x-internxt-captcha': token,
    };

    return SdkManager.instance.getSend(customHeaders).createSendLink(payload);
  }

  static async uploadFilesAndGetLink(
    itemList: SendItemData[],
    emailInfo?: EmailInfo,
    opts?: {
      progress?: (totalBytes: number, uploadedBytes: number) => void;
      abortController?: AbortController;
    },
  ): Promise<string> {
    const itemFiles = [] as SendLinkWithFile[];
    const sendLinksFolders = [] as SendLink[];
    itemList.forEach((item) => {
      if (item.type === 'file') {
        itemFiles.push({
          id: item.id,
          name: item.name,
          type: item.type,
          size: item.size,
          encryptionKey: '',
          networkId: '',
          parent_folder: item.parent_folder,
          file: item.file as FileWithNetworkId,
        });
      } else if (item.type === 'folder') {
        sendLinksFolders.push({
          id: item.id,
          name: item.name,
          type: item.type,
          size: item.size,
          encryptionKey: '',
          networkId: '',
          parent_folder: item.parent_folder,
        });
      }
    });
    const sendLinksFiles = await UploadService.uploadFiles(itemFiles, opts);
    const items = [...sendLinksFolders, ...sendLinksFiles];
    const randomMnemonic = generateMnemonic(256);
    const code = stringUtils.generateRandomStringUrlSafe(8);
    const encryptedCode = aes.encrypt(code, randomMnemonic);
    const encryptedMnemonic = aes.encrypt(randomMnemonic, code);

    const itemsWithEncryptionKeyEncrypted = items.map((item) => {
      return {
        ...item,
        encryptionKey: aes.encrypt(item.encryptionKey, code),
      };
    });

    const createSendLinksPayload: CreateSendLinksPayload = {
      ...emailInfo,
      items: itemsWithEncryptionKeyEncrypted,
      code: encryptedCode,
      mnemonic: encryptedMnemonic,
      plainCode: code,
    } as CreateSendLinksPayload;

    const createSendLinkResponse = await UploadService.storeSendLinks(createSendLinksPayload);

    const encodedSendId = stringUtils.encodeV4Uuid(createSendLinkResponse.id);

    return `${originUrl}/d/${encodedSendId}/${code}`;
  }

  static async uploadFiles(
    files: SendLinkWithFile[],
    opts?: {
      progress?: (totalBytes: number, uploadedBytes: number) => void;
      abortController?: AbortController;
    },
  ): Promise<SendLink[]> {
    if (files.length > MAX_ITEMS_PER_LINK) {
      throw new MaximumItemsNumberLimitReachedError();
    }

    const totalBytes = files.reduce((a, f) => a + f.size, 0);
    if (totalBytes > MAX_BYTES_PER_SEND) {
      throw new Error('Maximum allowed total upload size is ' + MAX_BYTES_PER_SEND);
    }

    const uploadManager = new UploadManager(files, totalBytes, opts?.abortController);
    return uploadManager.run(opts?.progress);
  }
}

class UploadManager {
  private networkService = NetworkService.getInstance();
  private filesGroups: Record<
    FileSizeType,
    {
      upperBound: number;
      lowerBound: number;
      concurrency: number;
    }
  > = {
    [FileSizeType.Big]: {
      upperBound: Infinity,
      lowerBound: oneHundredMbytes,
      concurrency: 1,
    },
    [FileSizeType.Medium]: {
      upperBound: oneHundredMbytes - 1,
      lowerBound: twentyMbytes,
      concurrency: 3,
    },
    [FileSizeType.Small]: {
      upperBound: twentyMbytes - 1,
      lowerBound: 1,
      concurrency: 6,
    },
  };

  private errored = false;
  private uploadsProgress: Record<string, number> = {};
  private uploadQueue: QueueObject<SendLinkWithFile> = queue<SendLinkWithFile>(
    (sendLinkWithFile, next: (err: Error | null, res?: SendLinkWithFile) => void) => {
      const file = sendLinkWithFile.file;
      const networkService = this.networkService;
      const uploadId = randomBytes(10).toString('hex');

      this.uploadsProgress[uploadId] = 0;

      networkService
        .uploadFile(file, {
          abortController: this.abortController,
          progress: (_, uploadedBytes) => {
            this.uploadsProgress[uploadId] = uploadedBytes;
          },
        })
        .then((networkId) => {
          const fileObject = Object.assign({}, { ...file, networkId });
          next(null, Object.assign({}, { ...sendLinkWithFile, file: fileObject }));
        })
        .catch((err) => {
          if (!this.errored) {
            this.uploadQueue.kill();
          }

          this.errored = true;

          next(err);
        });
    },
    this.filesGroups.small.concurrency,
  );

  private abortController?: AbortController;
  private items: SendLinkWithFile[];
  private totalBytes: number;

  constructor(items: SendLinkWithFile[], totalBytes: number, abortController?: AbortController) {
    this.items = items;
    this.totalBytes = totalBytes;
    this.abortController = abortController;
  }

  private classifyFilesBySize(files: SendLinkWithFile[]): [SendLinkWithFile[], SendLinkWithFile[], SendLinkWithFile[]] {
    return [
      files.filter((f) => f.size >= this.filesGroups.big.lowerBound),
      files.filter((f) => f.size >= this.filesGroups.medium.lowerBound && f.size <= this.filesGroups.medium.upperBound),
      files.filter((f) => f.size >= this.filesGroups.small.lowerBound && f.size <= this.filesGroups.small.upperBound),
    ];
  }

  async run(progress?: (totalBytes: number, uploadedBytes: number) => void): Promise<SendLink[]> {
    const progressInterval = setInterval(() => {
      const uploadedBytes = Object.values(this.uploadsProgress).reduce((a, p) => a + p, 0);
      progress?.(this.totalBytes, uploadedBytes);
    }, 500);

    try {
      const [bigSizedFiles, mediumSizedFiles, smallSizedFiles] = this.classifyFilesBySize(this.items);
      const filesReferences: SendLink[] = [];

      const uploadFiles = async (files: SendLinkWithFile[], concurrency: number) => {
        this.uploadQueue.concurrency = concurrency;

        const uploadPromises: Promise<SendLinkWithFile>[] = await this.uploadQueue.pushAsync(files);
        const uploadedFiles = await Promise.all(uploadPromises);

        for (const uploadedFile of uploadedFiles) {
          filesReferences.push({
            id: uploadedFile.id,
            encryptionKey: this.networkService.encryptionKey,
            name: uploadedFile.name,
            networkId: uploadedFile.file.networkId,
            size: uploadedFile.size,
            type: uploadedFile.type,
            parent_folder: uploadedFile.parent_folder,
          });
        }
      };

      if (smallSizedFiles.length > 0) await uploadFiles(smallSizedFiles, this.filesGroups.small.concurrency);

      if (mediumSizedFiles.length > 0) await uploadFiles(mediumSizedFiles, this.filesGroups.medium.concurrency);

      if (bigSizedFiles.length > 0) await uploadFiles(bigSizedFiles, this.filesGroups.big.concurrency);

      return filesReferences;
    } finally {
      clearInterval(progressInterval);
    }
  }
}

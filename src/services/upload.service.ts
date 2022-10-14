import { randomBytes } from "crypto";
import { queue, QueueObject } from "async";
import { generateMnemonic } from 'bip39';
import axios from "axios";
import { aes } from "@internxt/lib";

import { MAX_ITEMS_PER_LINK, MAX_BYTES_PER_SEND } from "../constants";
import { NetworkService } from "./network.service";

interface FileWithNetworkId extends File {
  networkId: string;
}

enum FileSizeType {
  Big = "big",
  Medium = "medium",
  Small = "small",
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
    super("Maximum allowed files to upload is " + MAX_ITEMS_PER_LINK);
  }
}

export class UploadService {
  static async uploadFilesAndGetLink(
    files: File[],
    emailInfo?: EmailInfo,
    opts?: {
      progress?: (totalBytes: number, uploadedBytes: number) => void;
      abortController?: AbortController;
    }
  ): Promise<string> {
    const items = await UploadService.uploadFiles(files, opts);

    const randomMnemonic = generateMnemonic(256);
    const code = randomBytes(32).toString("hex");
    const encryptedCode = aes.encrypt(code, randomMnemonic);
    const encryptedMnemonic = aes.encrypt(randomMnemonic, code);

    const itemsWithEncryptionKeyEncrypted = items.map((i) => {
      return {
        ...i,
        encryptionKey: aes.encrypt(i.encryptionKey, code),
      };
    });

    const createSendLinksPayload: CreateSendLinksPayload = {
      ...emailInfo,
      items: itemsWithEncryptionKeyEncrypted,
      code: encryptedCode,
      mnemonic: encryptedMnemonic,
      plainCode: code
    } as CreateSendLinksPayload;

    const createSendLinkResponse = await storeSendLinks(createSendLinksPayload);

    return window.origin + "/download/" + createSendLinkResponse.id + '?code=' + code;
  }

  static async uploadFiles(
    files: File[],
    opts?: {
      progress?: (totalBytes: number, uploadedBytes: number) => void;
      abortController?: AbortController;
    }
  ): Promise<SendLink[]> {
    console.log(files);

    if (files.length > MAX_ITEMS_PER_LINK) {
      throw new MaximumItemsNumberLimitReachedError();
    }

    const totalBytes = files.reduce((a, f) => a + f.size, 0);
    if (totalBytes > MAX_BYTES_PER_SEND) {
      throw new Error(
        "Maximum allowed total upload size is " + MAX_BYTES_PER_SEND
      );
    }

    const networkToken = await NetworkService.getInstance().getShareToken();

    const uploadManager = new UploadManager(files, opts?.abortController);
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
  private uploadQueue: QueueObject<File> = queue<File>(
    (
      file,
      next: (
        err: Error | null,
        res?: Pick<File, "name" | "size"> & { networkId: string }
      ) => void
    ) => {
      const networkService = this.networkService;
      const uploadId = randomBytes(10).toString("hex");

      this.uploadsProgress[uploadId] = 0;

      networkService
        .uploadFile(file, {
          abortController: this.abortController,
          progress: (_, uploadedBytes) => {
            this.uploadsProgress[uploadId] = uploadedBytes;
          },
        })
        .then((networkId) => {
          next(null, {
            name: file.name,
            size: file.size,
            networkId,
          });
        })
        .catch((err) => {
          if (!this.errored) {
            this.uploadQueue.kill();
          }

          this.errored = true;

          next(err);
        });
    },
    this.filesGroups.small.concurrency
  );

  private abortController?: AbortController;
  private files: File[];

  constructor(files: File[], abortController?: AbortController) {
    this.files = files;
    this.abortController = abortController;
  }

  private classifyFilesBySize(files: File[]): [File[], File[], File[]] {
    return [
      files.filter((f) => f.size >= this.filesGroups.big.lowerBound),
      files.filter(
        (f) =>
          f.size >= this.filesGroups.medium.lowerBound &&
          f.size <= this.filesGroups.medium.upperBound
      ),
      files.filter(
        (f) =>
          f.size >= this.filesGroups.small.lowerBound &&
          f.size <= this.filesGroups.small.upperBound
      ),
    ];
  }

  async run(
    progress?: (totalBytes: number, uploadedBytes: number) => void
  ): Promise<SendLink[]> {
    const totalBytes = this.files.reduce((a, f) => a + f.size, 0);
    const progressInterval = setInterval(() => {
      const uploadedBytes = Object.values(this.uploadsProgress).reduce(
        (a, p) => a + p,
        0
      );

      progress?.(totalBytes, uploadedBytes);
    }, 500);

    try {
      const [bigSizedFiles, mediumSizedFiles, smallSizedFiles] =
        this.classifyFilesBySize(this.files);
      const filesReferences: SendLink[] = [];

      const uploadFiles = async (files: File[], concurrency: number) => {
        this.uploadQueue.concurrency = concurrency;

        const uploadPromises: Promise<FileWithNetworkId>[] =
          await this.uploadQueue.pushAsync(files);
        const uploadedFiles = await Promise.all(uploadPromises);

        for (const uploadedFile of uploadedFiles) {
          filesReferences.push({
            encryptionKey: this.networkService.encryptionKey,
            name: uploadedFile.name,
            networkId: uploadedFile.networkId,
            size: uploadedFile.size,
            type: "file",
          });
        }
      };

      if (smallSizedFiles.length > 0)
        await uploadFiles(smallSizedFiles, this.filesGroups.small.concurrency);

      if (mediumSizedFiles.length > 0)
        await uploadFiles(
          mediumSizedFiles,
          this.filesGroups.medium.concurrency
        );

      if (bigSizedFiles.length > 0)
        await uploadFiles(bigSizedFiles, this.filesGroups.big.concurrency);

      return filesReferences;
    } finally {
      clearInterval(progressInterval);
    }
  }
}

/**
 * TODO: SDK
 */
interface SendLink {
  name: string;
  type: "file";
  size: number;
  networkId: string;
  encryptionKey: string;
}

interface CreateSendLinksPayload {
  sender?: string;
  receivers?: string[];
  code: string;
  title?: string;
  subject?: string;
  items: SendLink[];
  mnemonic: string;
}

interface CreateSendLinksResponse {
  id: string;
  title: string;
  subject: string;
  code: string;
  sender: string;
  receivers: string[];
  views: number;
  userId: number;
  items: SendLink[];
  createdAt: string;
  updatedAt: string;
  expirationAt: string;
}

async function storeSendLinks(payload: CreateSendLinksPayload) {
  const res = await axios.post<CreateSendLinksResponse>(
    process.env.REACT_APP_API_URL + "/api/links",
    payload
  );

  return res.data;
}

import { NetworkService } from "./network.service";
import { FlatFolderZip } from "./zip/FlatFolderZip";
import axios from "axios";
import { aes } from "@internxt/lib";

type DownloadFileOptions = {
  progress?: (totalBytes: number, downloadedBytes: number) => void;
  abortController?: AbortController;
};

export class DownloadService {
  static async downloadFilesFromLink(
    linkId: string,
    opts?: DownloadFileOptions
  ): Promise<void> {
    const networkService = NetworkService.getInstance();
    const { title, items, code, size } = await getSendLink(linkId);
    const decryptedCode = aes.decrypt(code, networkService.encryptionKey);

    const itemsWithPlainEncryptionKey = items.map((item) => {
      return { ...item, encryptionKey: aes.decrypt(item.encryptionKey, decryptedCode) };
    });

    await DownloadService.downloadFiles(
      title,
      itemsWithPlainEncryptionKey,
      NetworkService.getInstance(),
      opts
    );
  }

  static async downloadFiles(
    zipName: string,
    items: SendItem[],
    networkService: NetworkService,
    opts?: DownloadFileOptions
  ) {
    const totalBytes = items.reduce((a, f) => a + f.size, 0);
    const zip = new FlatFolderZip(zipName, {
      progress: (downloadedBytes) => {
        opts?.progress?.(totalBytes, Math.min(downloadedBytes, totalBytes));
      },
    });

    for (const item of items) {
      const itemDownloadStream = await networkService.getDownloadFileStream(
        item.networkId,
        { abortController: opts?.abortController }
      );

      zip.addFile(item.name, itemDownloadStream);
    }

    await zip.close();
  }
}

/**
 * TODO: SDK
 */
interface SendItem {
  id: string;
  name: string;
  type: string;
  linkId: string;
  networkId: string;
  encryptionKey: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetSendLinkResponse {
  id: string;
  title: string;
  subject: string;
  code: string;
  views: number;
  userId: number | null;
  items: SendItem[];
  createdAt: string;
  updatedAt: string;
  expirationAt: string;
  size: number;
}

export async function getSendLink(
  linkId: string
): Promise<GetSendLinkResponse> {
  const res = await axios.get<GetSendLinkResponse>(
    process.env.REACT_APP_API_URL + "/api/links/" + linkId
  );

  return res.data;
}

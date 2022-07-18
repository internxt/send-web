import axios from "axios";
import fileDownload from "js-file-download";

import { NetworkService } from "./network.service";
import { FlatFolderZip } from "./zip/FlatFolderZip";

import { binaryStreamToBlob } from "../network/streams";
import { SendItem } from "../models/SendItem";

type DownloadFileOptions = {
  progress?: (totalBytes: number, downloadedBytes: number) => void;
  abortController?: AbortController;
  plainCode?: string;
};

/**
 * This service has *the only responsability* of downloading 
 * the content via browser to the user filesystem.
 */
export class DownloadService {
  static async downloadFilesFromLink(
    linkId: string,
    opts?: DownloadFileOptions
  ): Promise<void> {
    const { title, items, code, size } = await getSendLink(linkId);

    await DownloadService.downloadFiles(
      title ?? "download",
      items,
      NetworkService.getInstance(),
      opts?.plainCode || code,
      opts
    );
  }

  static async downloadFiles(
    zipName: string,
    items: SendItem[],
    networkService: NetworkService,
    plainCode: string,
    opts?: DownloadFileOptions
  ) {
    const totalBytes = items.reduce((a, f) => a + f.size, 0);

    if(items.length > 1) {
      const zip = new FlatFolderZip(zipName, {
        progress: (downloadedBytes) => {
          opts?.progress?.(totalBytes, Math.min(downloadedBytes, totalBytes));
        },
      });

      for (const item of items) {
        const itemDownloadStream = await networkService.getDownloadFileStream(
          item,
          plainCode,
          { abortController: opts?.abortController }
        );

        zip.addFile(item.name, itemDownloadStream);
      }

      await zip.close();
    } else {
      const [firstItem] = items;
      const itemDownloadStream = await networkService.getDownloadFileStream(
        firstItem,
        plainCode,
        { abortController: opts?.abortController }
      );

      return fileDownload(
        await binaryStreamToBlob(itemDownloadStream),
        firstItem.name
      );
    }
  }

}

/**
 * TODO: SDK
 */
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

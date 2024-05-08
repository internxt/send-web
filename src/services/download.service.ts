import axios from "axios";
import fileDownload from "js-file-download";

import { NetworkService, ProgressOptions } from "./network.service";
import { FlatFolderZip } from "./zip/FlatFolderZip";

import { binaryStreamToBlob } from "../network/streams";
import { SendItem } from "../models/SendItem";
import { StreamService } from "./stream.service";
import { getAllItemsList } from "./items.service";


/**
 * This service has *the only responsability* of downloading 
 * the content via browser to the user filesystem.
 */
export class DownloadService {
  static async downloadFilesFromLink(
    linkId: string,
    opts?: ProgressOptions
  ): Promise<void> {
    const { title, items, code } = await getSendLink(linkId);
    const date = new Date();
    const now = date.getFullYear() + String(date.getMonth() + 1).padStart(2, '0')
      + String(date.getDate()).padStart(2, '0') + String(date.getHours()).padStart(2, '0')
      + String(date.getMinutes()).padStart(2, '0') + String(date.getSeconds()).padStart(2, '0')
      + String(date.getMilliseconds()).padStart(3, '0');

    await DownloadService.downloadFiles(
      title && String(title).trim().length > 0 ? title : 'internxt-send_' + now,
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
    opts?: ProgressOptions
  ) {
    const totalBytes = items.reduce((a, f) => a + (f.type === 'file' ? f.size : 0), 0);

    const itemList = getAllItemsList(items);

    const options = {
      progress: (downloadedBytes: number) => {
        opts?.progress?.(opts.totalBytes || totalBytes, Math.min(downloadedBytes, opts.totalBytes || totalBytes));
      },
      abortController: opts?.abortController
    };

    if (itemList.length > 1 || (itemList.length === 1 && itemList[0].type === 'folder')) {
      const zip = new FlatFolderZip(zipName, options);

      for (const item of itemList) {
        await this.addItemToZip(zip, item, networkService, plainCode, opts);
      }

      await zip.close();
    } else {
      const [firstItem] = itemList;
      if (firstItem.type === 'file') {
        const itemDownloadStream = await networkService.getDownloadFileStream(
          firstItem,
          plainCode,
          opts
        );

        const oneGigabyte = 1 * 1024 * 1024 * 1024;
        if (firstItem.size > oneGigabyte) {
          await StreamService.pipeReadableToFileSystemStream(
            itemDownloadStream,
            firstItem.name,
            options
          )
        } else {
          fileDownload(
            await binaryStreamToBlob(itemDownloadStream),
            firstItem.name
          );
        }
      } else if (firstItem.type === 'folder') {
        const zip = new FlatFolderZip(firstItem.name, options);
        await this.addItemToZip(zip, firstItem, networkService, plainCode, opts);
        await zip.close();
      }
    }
  }

  static async addItemToZip(zip: FlatFolderZip, item: SendItem,
    networkService: NetworkService,
    plainCode: string,
    opts?: ProgressOptions) {
    if (item.type === 'file') {
      const itemDownloadStream = await networkService.getDownloadFileStream(
        item,
        plainCode
      );
      zip.addFile(item.path || item.name, itemDownloadStream);
    } else if (item.type === 'folder') {
      zip.addFolder(item.path || item.name);
    }
    if (item.childrenFiles && item.childrenFiles.length > 0) {
      await Promise.all(item.childrenFiles.map((childrenFile) => {
        return this.addItemToZip(zip, childrenFile, networkService, plainCode, opts);
      }));
    }

    if (item.childrenFolders && item.childrenFolders.length > 0) {
      await Promise.all(item.childrenFolders.map((childrenFolder) => {
        return this.addItemToZip(zip, childrenFolder, networkService, plainCode, opts);
      }));
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
    process.env.REACT_APP_SEND_API_URL + "/links/" + linkId
  );

  return res.data;
}

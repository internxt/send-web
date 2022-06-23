import { NetworkService } from "./network.service";
import { FlatFolderZip } from "./zip/FlatFolderZip";

interface SharedFile {
  name: string;
  networkId: string;
  size: number;
}

// interface SharedFolder {
//   mnemonic: string;
//   children: SharedFile[];
// }

// type Item = SharedFile | SharedFolder;
type Item = SharedFile;
type DownloadFileOptions = {
  progress?: (totalBytes: number, downloadedBytes: number) => void,
  abortController?: AbortController
}

export class DownloadService {
  static async downloadFiles(
    zipName: string,
    items: Item[], 
    networkService: NetworkService,
    opts?: DownloadFileOptions
  ) {
    const totalBytes = items.reduce((a, f) => a + f.size, 0);
    const zip = new FlatFolderZip(zipName, {
      progress: (downloadedBytes) => {
        opts?.progress?.(totalBytes, downloadedBytes);
      }
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

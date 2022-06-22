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

export class DownloadService {
  static async downloadFiles(
    items: Item[], 
    networkService: NetworkService,
    onProgress?: (totalBytes: number, downloadedBytes: number) => void
  ) {
    const totalBytes = items.reduce((a, f) => a + f.size, 0);
    const zip = new FlatFolderZip('test', {
      progress: (downloadedBytes) => {
        onProgress && onProgress(totalBytes, downloadedBytes);
      }
    });

    for (const item of items) {
      const itemDownloadStream = await networkService.getDownloadFileStream(item.networkId);

      zip.addFile(item.name, itemDownloadStream);
    }

    await zip.close();
  }
}

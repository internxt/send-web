import streamSaver from 'streamsaver';
import fileDownload from 'js-file-download';

import { binaryStreamToBlob, buildProgressStream } from '../../network/streams';
import { loadWritableStreamPonyfill, createFolderWithFilesWritable, ZipStream } from "./Zip";

type FlatFolderZipOpts = {
  abortController?: AbortController;
  progress?: (loadedBytes: number) => void;
}
function isBrave() {
  const maybeBrave = (window.navigator as { brave?: any }).brave;

  return maybeBrave != undefined && maybeBrave.isBrave.name == "isBrave";
}
export class FlatFolderZip {
  private finished!: Promise<void>;
  private zip: ZipStream;
  private passThrough: ReadableStream<Uint8Array>; 
  private folderName: string;
  private abortController?: AbortController;

  constructor(folderName: string, opts: FlatFolderZipOpts) {
    this.folderName = folderName;
    this.zip = createFolderWithFilesWritable();
    this.abortController = opts.abortController;

    this.passThrough = opts.progress ?
      buildProgressStream(this.zip.stream, opts.progress) :
      this.zip.stream;

    const isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;

    if (isBrave()) return;

    if (isFirefox) {
      loadWritableStreamPonyfill().then(() => {
        streamSaver.WritableStream = window.WritableStream;

        this.finished = this.passThrough.pipeTo(
          streamSaver.createWriteStream(folderName + '.zip'),
          { signal: opts.abortController?.signal }
        );
      });
    } else {
      this.finished = this.passThrough.pipeTo(
        streamSaver.createWriteStream(folderName + '.zip'),
        { signal: opts.abortController?.signal }
      );
    }
  }

  addFile(name: string, source: ReadableStream<Uint8Array>): void {
    if (this.abortController?.signal.aborted) return;

    this.zip.addFile(name, source);
  }

  addFolder(name: string): void {
    if (this.abortController?.signal.aborted) return;

    this.zip.addFolder(name);
  }

  async close(): Promise<void> {
    if (this.abortController?.signal.aborted) return; 

    this.zip.end();

    if (isBrave()) {
      console.log('is Brave');
      return fileDownload(
        await binaryStreamToBlob(this.passThrough),
        `${this.folderName}.zip`,
        'application/zip'
      );
    }
  
    await this.finished;
  }

  abort(): void {
    this.abortController?.abort();
  }
}

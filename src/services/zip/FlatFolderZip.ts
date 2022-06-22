import streamSaver from 'streamsaver';

import { buildProgressStream } from '../stream.service';
import { loadWritableStreamPonyfill, createFolderWithFilesWritable, ZipStream } from "./Zip";

type FlatFolderZipOpts = {
  abortController?: AbortController;
  progress?: (loadedBytes: number) => void;
}
export class FlatFolderZip {
  private finished!: Promise<void>;
  private zip: ZipStream;
  private abortController?: AbortController;

  constructor(folderName: string, opts: FlatFolderZipOpts) {
    this.zip = createFolderWithFilesWritable();
    this.abortController = opts.abortController;

    const passThrough = opts.progress ?
      buildProgressStream(this.zip.stream, opts.progress) :
      this.zip.stream;

    const isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;

    if (isFirefox) {
      loadWritableStreamPonyfill().then(() => {
        streamSaver.WritableStream = window.WritableStream;

        this.finished = passThrough.pipeTo(
          streamSaver.createWriteStream(folderName + '.zip'),
          { signal: opts.abortController?.signal }
        );
      });
    } else {
      this.finished = passThrough.pipeTo(
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
    await this.finished;
  }

  abort(): void {
    this.abortController?.abort();
  }
}

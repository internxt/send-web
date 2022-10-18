import fileDownload from 'js-file-download';
import streamSaver from 'streamsaver';

import { loadWritableStreamPonyfill } from "../network/download";
import { binaryStreamToBlob, buildProgressStream } from '../network/streams';

function isBrave() {
  const maybeBrave = (window.navigator as { brave?: any }).brave;

  return maybeBrave !== undefined && maybeBrave.isBrave.name === "isBrave";
}

export class StreamService {
  static async pipeReadableToFileSystemStream(
    readable: ReadableStream, 
    fileSystemName: string,
    opts: {
      progress: (readBytes: number) => void,
      abortController?: AbortController
    }
  ): Promise<void> {
    const { progress } = opts;
    const passThrough = progress ? buildProgressStream(readable, progress) : readable;

    if (isBrave()) {
      fileDownload(await binaryStreamToBlob(passThrough), fileSystemName);
      return;
    }

    const isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;
    if (isFirefox) {
      await loadWritableStreamPonyfill();

      streamSaver.WritableStream = window.WritableStream;
    }

    await passThrough.pipeTo(
      streamSaver.createWriteStream(fileSystemName),
      { signal: opts.abortController?.signal }
    );
  }
}

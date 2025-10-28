import { Cipheriv } from 'crypto';
import { streamFileIntoChunks } from './streams';
import { createSHA256, createSHA512, ripemd160, sha256 } from 'hash-wasm';
import { mnemonicToSeed } from 'bip39';


/**
 * Given a stream and a cipher, encrypt its content
 * @param readable Readable stream
 * @param cipher Cipher used to encrypt the content
 * @returns A readable whose output is the encrypted content of the source stream
 */
export function encryptReadable(readable: ReadableStream<Uint8Array>, cipher: Cipheriv): ReadableStream<Uint8Array> {
  const reader = readable.getReader();

  const encryptedFileReadable = new ReadableStream({
    async start(controller) {
      let done = false;

      while (!done) {
        const status = await reader.read();

        if (!status.done) {
          controller.enqueue(cipher.update(status.value));
        }

        done = status.done;
      }
      controller.close();
    },
  });

  return encryptedFileReadable;
}

export async function getEncryptedFile(
  plainFile: { stream(): ReadableStream<Uint8Array> },
  cipher: Cipheriv,
  fileLength: number,
): Promise<[Uint8Array, string]> {
  const readable = encryptReadable(plainFile.stream(), cipher).getReader();
  const hasher = await createSHA256();
  hasher.init();
  const fileParts: Uint8Array = new Uint8Array(fileLength);

  let done = false;
  let offset = 0;

  while (!done) {
    const status = await readable.read();

    if (!status.done) {
      hasher.update(status.value);
      fileParts.set(status.value, offset);
      offset += status.value.length;
    }

    done = status.done;
  }

  const sha256Result = hasher.digest();

  return [
    fileParts,
    await getRipemd160FromHex(sha256Result),
  ];
}

/**
 * Computes ripmd160
 * @param {string} dataHex - The input data in HEX format
 * @returns {Promise<string>} The result of applying ripmd160 to the data.
 */
function getRipemd160FromHex(dataHex: string): Promise<string> {
  const data = Buffer.from(dataHex, 'hex');
  return ripemd160(data);
}

/**
 * Creates sha256 hasher
 * @returns {Promise<IHasher>} The sha256 hasher
 */
function getSha256Hasher() {
  return createSHA256();
}

export function getSha256(input: string): Promise<string> {
  return sha256(input);
}

/**
 * Computes sha512 from combined key and data
 * @param {Buffer} key - The key
 * @param {Buffer } data - The data
 * @returns {Promise<string>} The result of applying sha512 to the combined key and data.
 */
async function getSha512Combined(key: Buffer, data: Buffer): Promise<string> {
  const hash = await createSHA512();
  return hash.init().update(key).update(data).digest();
}

/**
 * Given a stream and a cipher, encrypt its content on pull
 * @param readable Readable stream
 * @param cipher Cipher used to encrypt the content
 * @returns A readable whose output is the encrypted content of the source stream
 */
export function encryptReadablePull(readable: ReadableStream<Uint8Array>, cipher: Cipheriv): ReadableStream<Uint8Array> {
  const reader = readable.getReader();

  return new ReadableStream({
    async pull(controller) {
      console.log('2ND_STEP: PULLING');
      const status = await reader.read();

      if (!status.done) {
        controller.enqueue(cipher.update(status.value));
      } else {
        controller.close();
      }
    },
  });
}

export function encryptStreamInParts(
  plainFile: { size: number; stream(): ReadableStream<Uint8Array> },
  cipher: Cipheriv,
  parts: number,
): ReadableStream<Uint8Array> {
  // We include a marginChunkSize because if we split the chunk directly, there will always be one more chunk left, this will cause a mismatch with the urls provided
  const marginChunkSize = 1024;
  const chunkSize = plainFile.size / parts + marginChunkSize;
  const readableFileChunks = streamFileIntoChunks(plainFile.stream(), chunkSize);

  return encryptReadablePull(readableFileChunks, cipher);
}

export async function processEveryFileBlobReturnHash(
  chunkedFileReadable: ReadableStream<Uint8Array>,
  onEveryChunk: (part: Uint8Array) => Promise<void>,
): Promise<string> {
  const reader = chunkedFileReadable.getReader();
  const hasher = await getSha256Hasher();
  hasher.init();

  let done = false;

  while (!done) {
    const status = await reader.read();
    if (!status.done) {
      const value = status.value;
      hasher.update(value);
      await onEveryChunk(value);
    }

    done = status.done;
  }

  const sha256Result = hasher.digest();
  return await getRipemd160FromHex(sha256Result);
}

export async function generateFileKey(mnemonic: string, bucketId: string, index: Buffer): Promise<Buffer> {
  const bucketKey = await generateFileBucketKey(mnemonic, bucketId);

  return (await getFileDeterministicKey(bucketKey.subarray(0, 32), index)).subarray(0, 32);
}

export async function generateFileBucketKey(mnemonic: string, bucketId: string): Promise<Buffer> {
  const seed = await mnemonicToSeed(mnemonic);

  return getFileDeterministicKey(seed, Buffer.from(bucketId, 'hex'));
}

export async function getFileDeterministicKey(key: Buffer, data: Buffer): Promise<Buffer> {
  const hashHex = await getSha512Combined(key, data);
  return Buffer.from(hashHex, 'hex');
}

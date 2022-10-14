import { FileWithPath } from "react-dropzone";

export interface SendItem {
  id: string;
  name: string;
  type: string;
  linkId: string;
  networkId: string;
  encryptionKey: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export interface SendItemFile {
  id: string;
  name: string;
  size: number;
  isFolder?: boolean;
  file?: FileWithPath;
}
export interface SendItemFolder {
  id: string;
  name: string;
  size: number;
  isFolder?: boolean;
  countFiles?: number;
  childrenFiles?: SendItemFile[];
  childrenFolders?: SendItemFolder[];
}

export type SendItemData = SendItemFile & SendItemFolder;

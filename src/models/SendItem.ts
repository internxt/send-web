import { FileWithPath } from "react-dropzone";

export interface SendItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  linkId: string;
  networkId: string;
  encryptionKey: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  parent_folder: string | null;
}

export interface SendItemFile {
  id: string;
  name: string;
  size: number;
  type: 'file' | 'folder';
  parent_folder: string | null;
  file?: FileWithPath;
}

export interface SendItemFolder {
  id: string;
  name: string;
  size: number;
  type: 'file' | 'folder';
  parent_folder: string | null;
  countFiles?: number;
  childrenFiles?: SendItemFile[];
  childrenFolders?: SendItemFolder[];
}

export type SendItemData = SendItemFile & SendItemFolder;

import { FileWithPath } from "react-dropzone";

export interface SendItemBasic {
  id: string;
  name: string;
  size: number;
  type: 'file' | 'folder';
  parent_folder: string | null;
}

export interface SendItem extends SendItemBasic {
  linkId: string;
  networkId: string;
  encryptionKey: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  path?: string;
  countFiles?: number;
  childrenFiles?: SendItem[];
  childrenFolders?: SendItem[];
}

export interface SendItemFile extends SendItemBasic {
  file?: FileWithPath;
}

export interface SendItemFolder extends SendItemBasic {
  countFiles?: number;
  childrenFiles?: SendItemFile[];
  childrenFolders?: SendItemFolder[];
}

export type SendItemData = SendItemFile & SendItemFolder;

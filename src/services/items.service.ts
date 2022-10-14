import { FileWithPath } from "react-dropzone";
import { SendItemData, SendItemFile, SendItemFolder } from "../models/SendItem";


export const getPathFromFile = (file: FileWithPath): string => {
  let filePath = file.path || file.webkitRelativePath || '';
  if (file.path && file.path.trim().length > 0) {
    filePath = file.path;
  } else if (file.webkitRelativePath && file.webkitRelativePath.trim().length > 0) {
    filePath = file.webkitRelativePath;
  }

  if (filePath.charAt(0) === '/') {
    filePath = filePath.substring(1);
  }
  return filePath;
};

export const transformInputFilesToJSON = (files: FileWithPath[]): JSON => {
  const result = {} as JSON;
  for (const file of files) {
    const filePath = getPathFromFile(file);
    filePath.split('/').reduce(
      (previousValue: { [key: string]: any }, currentValue, currentIndex, arrayPaths) => {
        if (arrayPaths.length === 0 || (arrayPaths.length === 1 && arrayPaths[0].trim() === '')) {
          return previousValue[file.name] = file;
        } else if (currentIndex === arrayPaths.length - 1) {
          previousValue[currentValue] = file;
        }
        return previousValue[currentValue] = previousValue[currentValue] || {};
      }
      , result);
  }
  return result;
};

export const transformJsonFilesToItems = (jsonObject: JSON): {
  rootFolders: Array<SendItemFolder>;
  rootFiles: Array<SendItemFile>;
} => {
  const rootFolders = [] as SendItemFolder[];
  const rootFiles = [] as SendItemFile[];

  for (const [key, value] of Object.entries(jsonObject)) {
    if (value instanceof File) {
      rootFiles.push({
        id: '',
        name: value.name,
        size: value.size,
        isFolder: false,
        file: value
      });
    } else {
      const { childrenFiles, childrenFilesSize } = getChildrenFiles(value);
      const { childrenFolders, childrenFoldersSize, childrenFolderCountFiles } = getChildrenFolders(value);
      rootFolders.push({
        id: '',
        name: key,
        size: childrenFilesSize + childrenFoldersSize,
        isFolder: true,
        countFiles: childrenFiles.length + childrenFolderCountFiles,
        childrenFiles: childrenFiles,
        childrenFolders: childrenFolders
      });
    }
  }
  return { rootFolders, rootFiles };
};

export const getChildrenFiles = (jsonObject: JSON): {
  childrenFiles: SendItemFile[],
  childrenFilesSize: number
} => {
  const childrenFiles = [] as SendItemFile[];
  let childrenFilesSize = 0;
  for (const [key, value] of Object.entries(jsonObject)) {
    if (value instanceof File) {
      childrenFilesSize += value.size;
      childrenFiles.push({
        id: '',
        name: key,
        size: value.size,
        isFolder: false,
        file: value
      });
    }
  }
  return { childrenFiles, childrenFilesSize };
};

export const getChildrenFolders = (jsonObject: JSON): {
  childrenFolders: SendItemFolder[],
  childrenFoldersSize: number,
  childrenFolderCountFiles: number
} => {
  const totalChildrenFolders = [] as SendItemFolder[];
  let totalChildrenFoldersSize = 0;
  let totalChildrenFoldersCountFiles = 0;
  for (const [key, value] of Object.entries(jsonObject)) {
    if (!(value instanceof File)) {
      const { childrenFiles, childrenFilesSize } = getChildrenFiles(value);
      const { childrenFolders, childrenFoldersSize, childrenFolderCountFiles } = getChildrenFolders(value);
      totalChildrenFolders.push({
        id: '',
        name: key,
        size: childrenFilesSize + childrenFoldersSize,
        isFolder: true,
        countFiles: childrenFiles.length + childrenFolderCountFiles,
        childrenFiles: childrenFiles,
        childrenFolders: childrenFolders
      });
      totalChildrenFoldersSize += childrenFilesSize + childrenFoldersSize;
      totalChildrenFoldersCountFiles += childrenFiles.length + childrenFolderCountFiles;
    }
  }
  return {
    childrenFolders: totalChildrenFolders,
    childrenFoldersSize: totalChildrenFoldersSize,
    childrenFolderCountFiles: totalChildrenFoldersCountFiles
  };
};

export const normalizeItemsId = (items: SendItemData[]): SendItemData[] => {
  return items.map((item, index) => { item.id = String(index); return item; });
};


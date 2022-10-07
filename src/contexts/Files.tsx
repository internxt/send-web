import { format } from "bytes";
import { createContext, ReactNode, useState } from "react";
import { MAX_BYTES_PER_SEND, MAX_ITEMS_PER_LINK } from "../constants";
import notificationsService, {
  ToastType,
} from "../services/notifications.service";

type Folder = { size: number; name: string };

type FilesByFolders = Record<
  Folder["name"],
  { files: File[]; folderInfo?: Folder }
>;

export type FileWithPath = File & {
  path: string;
  lastModifiedDate: Date;
}; // TODO: NEED TO REVIEW THIS TYPE,
// WHEN ADD IT FROM THE INPUT IT NOS HAS PATH ATTRIBUTE

type FilesContextT = {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  files: File[];
  filesWithoutFolders: FileWithPath[];
  filesInFolders: FilesByFolders;
  addFiles: (file: File[]) => void;
  removeFile: (path: string) => void;
  removeFolder: (folderName: string) => void;
  clear: () => void;
};

export const FilesContext = createContext<FilesContextT>({} as FilesContextT);

export const FilesProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<FileWithPath[]>([]);
  const [filesInFolders, setFilesInFolders] = useState<FilesByFolders>({});
  const [filesWithoutFolders, setFilesWithoutFolders] = useState<
    FileWithPath[]
  >([]);

  const [enabled, setEnabled] = useState(true);

  function addFiles(files: File[]) {
    const thereAreEmptyFiles = files.some((file) => file.size === 0);
    if (thereAreEmptyFiles) {
      notificationsService.show({
        text: "Empty files are not supported",
        type: ToastType.Warning,
      });
      return;
    }

    const currentTotalSize = state.reduce(
      (prev, current) => prev + current.size,
      0
    );
    const newFilesTotalSize = files.reduce(
      (prev, current) => prev + current.size,
      0
    );

    if (state.length + files.length > MAX_ITEMS_PER_LINK) {
      return notificationsService.show({
        text: `The maximum number of files allowed in total is ${MAX_ITEMS_PER_LINK}`,
        type: ToastType.Warning,
      });
    }
    console.log({ files });

    if (currentTotalSize + newFilesTotalSize <= MAX_BYTES_PER_SEND) {
      setState([...state, ...(files as FileWithPath[])]);

      const { rawFiles, mappedFolderFiles } = getFolderFiles(files);

      setFilesInFolders({ ...filesInFolders, ...mappedFolderFiles });

      setFilesWithoutFolders([
        ...filesWithoutFolders,
        ...(rawFiles as FileWithPath[]),
      ]);
    } else {
      notificationsService.show({
        text: `The maximum size allowed is ${format(
          MAX_BYTES_PER_SEND
        )} in total`,
        type: ToastType.Warning,
      });
    }
  }

  const getRootFolderNameFromPath = (path: string): string =>
    path.split("/")[1] ?? "";

  const removeFolder = (folderName: string) => {
    setState(
      state.filter((file) => {
        const fileFolder = getRootFolderNameFromPath(file.path);
        return fileFolder !== folderName;
      })
    );
    const { [folderName]: _, ...rest } = filesInFolders;
    setFilesInFolders(rest);
  };

  const removeFile = (path: string) => {
    setState(state.filter((file) => file.path !== path));
    setFilesWithoutFolders(
      filesWithoutFolders.filter((file) => file.path !== path)
    );
  };

  const getFolderFiles = (
    files: File[]
  ): {
    rawFiles: File[];
    mappedFolderFiles: FilesByFolders;
  } => {
    let mappedFolderFiles: Record<
      string,
      { files: File[]; folderInfo?: Folder }
    > = {};

    const rawFiles = files.filter((file) => {
      const { path } = file as FileWithPath;

      if (typeof path === "string" && path !== file.name) {
        mappedFolderFiles = addFolderFilesToMappedObject(
          mappedFolderFiles,
          file as FileWithPath
        );
        return false;
      }
      return true;
    });

    return { rawFiles, mappedFolderFiles };
  };

  const addFolderFilesToMappedObject = (
    mappedFolderFiles: FilesByFolders,
    file: FileWithPath
  ) => {
    const folderName: string = getRootFolderNameFromPath(file.path);
    return {
      ...mappedFolderFiles,
      [folderName]: mappedFolderFiles[folderName]
        ? {
            files: [...mappedFolderFiles[folderName]?.files, file],
            folderInfo: {
              name: folderName,
              size:
                (mappedFolderFiles[folderName]?.folderInfo?.size ?? 0) +
                file.size,
            },
          }
        : {
            files: [file],
            folderInfo: { name: folderName, size: file.size },
          },
    };
  };

  function clear() {
    setState([]);
    setFilesInFolders({});
    setFilesWithoutFolders([]);
  }

  return (
    <FilesContext.Provider
      value={{
        enabled,
        setEnabled,
        files: state,
        filesInFolders,
        filesWithoutFolders,
        addFiles,
        removeFile,
        removeFolder,
        clear,
      }}
    >
      {children}
    </FilesContext.Provider>
  );
};

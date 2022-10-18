import { format } from "bytes";
import { createContext, ReactNode, useEffect, useState } from "react";
import { FileWithPath } from "react-dropzone";
import { MAX_BYTES_PER_SEND, MAX_ITEMS_PER_LINK } from "../constants";
import { SendItemData } from "../models/SendItem";
import { transformInputFilesToJSON, transformJsonFilesToItems } from "../services/items.service";
import notificationsService, {
  ToastType,
} from "../services/notifications.service";

type FilesContextT = {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  itemList: SendItemData[];
  totalFilesCount: number;
  totalFilesSize: number;
  addFiles: (file: FileWithPath[]) => void;
  removeItem: (file: SendItemData) => void;
  clear: () => void;
};

export const FilesContext = createContext<FilesContextT>({} as FilesContextT);

export const FilesProvider = ({ children }: { children: ReactNode }) => {
  const [itemList, setItemList] = useState<SendItemData[]>([]);
  const [totalFilesCount, setTotalFilesCount] = useState(0);
  const [totalFilesSize, setTotalFilesSize] = useState(0);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setTotalFilesCount(itemList.reduce(
      (prev, current) => prev + (current.type === 'folder' ? current.countFiles || 0 : 1),
      0
    ));
    setTotalFilesSize(itemList.reduce(
      (prev, current) => prev + current.size,
      0
    ));
  }, [itemList]);

  const addFiles = (newFileList: FileWithPath[]) => {
    const thereAreEmptyFiles = newFileList.some((file) => file.size === 0);
    if (thereAreEmptyFiles) {
      notificationsService.show({
        text: "Empty files are not supported",
        type: ToastType.Warning,
      });
      return;
    }

    const newFilesTotalSize = newFileList.reduce(
      (prev, current) => prev + current.size,
      0
    );

    if (totalFilesCount + newFileList.length > MAX_ITEMS_PER_LINK) {
      return notificationsService.show({
        text: `The maximum number of files allowed in total is ${MAX_ITEMS_PER_LINK}`,
        type: ToastType.Warning,
      });
    }

    if (totalFilesSize + newFilesTotalSize <= MAX_BYTES_PER_SEND) {
      const filesJson = transformInputFilesToJSON(newFileList);
      let { rootFolders, rootFiles } = transformJsonFilesToItems(filesJson);

      rootFolders = rootFolders.filter((folder) => {
        const sameNameItems = itemList.filter(item => item.name === folder.name);
        return sameNameItems.length === 0;
      });

      rootFiles = rootFiles.filter((file) => {
        const sameNameItems = itemList.filter(item => item.name === file.name);
        return sameNameItems.length === 0;
      });

      const sendItemsList = [...rootFolders, ...rootFiles];
      setItemList([...itemList, ...sendItemsList]);
    } else {
      notificationsService.show({
        text: `The maximum size allowed is ${format(
          MAX_BYTES_PER_SEND
        )} in total`,
        type: ToastType.Warning,
      });
    }
  }

  const removeItem = (removeItem: SendItemData) => {
    setItemList(itemList.filter(item => item.id !== removeItem.id));
  };

  const clear = () => {
    setItemList([]);
  }

  return (
    <FilesContext.Provider
      value={{
        enabled,
        setEnabled,
        itemList,
        totalFilesCount,
        totalFilesSize,
        addFiles,
        removeItem,
        clear,
      }}
    >
      {children}
    </FilesContext.Provider>
  );
};

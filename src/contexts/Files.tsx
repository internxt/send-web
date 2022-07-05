import { format } from "bytes";
import { createContext, ReactNode, useState } from "react";
import { MAX_BYTES_PER_SEND } from "../constants";
import notificationsService, {
  ToastType,
} from "../services/notifications.service";

type FilesContextT = {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  files: File[];
  addFiles: (file: File[]) => void;
  removeFile: (index: number) => void;
  clear: () => void;
};

export const FilesContext = createContext<FilesContextT>({} as FilesContextT);

export const FilesProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<File[]>([]);

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

    const isFolder = files.some((file) => {
      const { path } = file as File & { path: string };
      if (typeof path === "string") {
        return path !== file.name;
      }
      return false;
    });

    if (isFolder) {
      notificationsService.show({
        text: "Folders are not supported",
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

    if (currentTotalSize + newFilesTotalSize <= MAX_BYTES_PER_SEND) {
      setState([...state, ...files]);
    } else {
      notificationsService.show({
        text: `The maximum size allowed is ${format(
          MAX_BYTES_PER_SEND
        )} in total`,
        type: ToastType.Warning,
      });
    }
  }

  function removeFile(index: number) {
    setState(state.filter((_, i) => i !== index));
  }

  function clear() {
    setState([]);
  }

  return (
    <FilesContext.Provider
      value={{ enabled, setEnabled, files: state, addFiles, removeFile, clear }}
    >
      {children}
    </FilesContext.Provider>
  );
};

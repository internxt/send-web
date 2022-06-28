import { createContext, ReactNode, useState } from "react";
import { MAX_BYTES_PER_SEND } from "../constants";

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

  function addFiles(file: File[]) {
    const currentTotalSize = state.reduce(
      (prev, current) => prev + current.size,
      0
    );
    const newFilesTotalSize = file.reduce(
      (prev, current) => prev + current.size,
      0
    );

    if (currentTotalSize + newFilesTotalSize <= MAX_BYTES_PER_SEND) {
      setState([...state, ...file]);
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

import { createContext, ReactNode, useState } from "react";

type FilesContextT = {
  files: File[];
  addFiles: (file: File[]) => void;
  removeFile: (index: number) => void;
  clear: () => void;
};

export const FilesContext = createContext<FilesContextT>({
  files: [],
  addFiles: () => undefined,
  removeFile: () => undefined,
  clear: () => undefined,
});

export const FilesProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<File[]>([]);

  function addFiles(file: File[]) {
    setState([...state, ...file]);
  }

  function removeFile(index: number) {
    setState(state.filter((_, i) => i !== index));
  }

  function clear() {
    setState([]);
  }

  return (
    <FilesContext.Provider
      value={{ files: state, addFiles, removeFile, clear }}
    >
      {children}
    </FilesContext.Provider>
  );
};

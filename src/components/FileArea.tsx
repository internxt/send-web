import { PlusCircle } from "phosphor-react";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { FilesContext } from "../contexts/Files";
import { format } from "bytes";
import { MAX_BYTES_PER_SEND } from "../constants";
import FileList from "./FileList";
import FolderList from "./FolderList";

export default function FileArea({
  className = "",
  scroll,
}: {
  className?: string;
  scroll: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const [mappedFolderFiles, setFolderFiles] = useState<
    Record<string, { files: File[]; folderInfo?: Folder }>
  >({});
  const [files, setFiles] = useState<(File & { path: string })[]>([]);
  console.log({ files });
  const fileContext = useContext(FilesContext);

  type Folder = { size: number; name: string };

  useEffect(() => {
    setFiles(fileContext.filesWithoutFolders);
    setFolderFiles(fileContext.filesInFolders);
  }, [fileContext.filesInFolders, fileContext.filesWithoutFolders]);

  const existsFiles = !!files.length;
  const existsFolders = !!Object.keys(mappedFolderFiles);

  function openFileExplorer() {
    fileInputRef.current?.click();
  }

  function openFolderExplorer() {
    folderInputRef.current?.click();
  }

  function onFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files)
      fileContext.addFiles(Array.from(event.target.files));
  }

  const spaceRemaining =
    MAX_BYTES_PER_SEND -
    fileContext.files.reduce((prev, current) => prev + current.size, 0);

  const foldersList = Object.values(mappedFolderFiles).map(
    (folder) => folder.folderInfo as File
  );

  return (
    <div className={`${className} flex flex-col`}>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={onFileInputChange}
        multiple
      />
      <input
        className="hidden"
        ref={folderInputRef}
        type="file"
        directory
        webkitdirectory
        onChange={onFileInputChange}
        multiple
      />
      {fileContext.files.length === 0 && (
        <Empty onClick={openFileExplorer} onTextClick={openFolderExplorer} />
      )}
      {fileContext.files.length !== 0 && (
        <>
          <div className="flex-1 bg-gray-1">
            {existsFolders && (
              <FolderList
                files={foldersList}
                onRemoveFolder={fileContext.removeFolder}
                className={`h-auto bg-gray-1 py-3 px-5 ${
                  scroll ? "overflow-y-auto" : ""
                } 
                ${existsFiles ? "pb-0" : ""}
                `}
              />
            )}
            {existsFiles && (
              <FileList
                files={files}
                onRemoveFile={fileContext.removeFile}
                className={`h-auto bg-gray-1 py-3 px-5 ${
                  scroll ? "overflow-y-auto" : ""
                }
                ${existsFolders ? "pt-0" : ""}
                `}
              />
            )}
          </div>
          <div
            className="flex cursor-pointer select-none items-center bg-gray-1 px-5 py-2.5"
            onClick={openFileExplorer}
          >
            <PlusCircle className="text-primary" size={28}></PlusCircle>
            <div className="ml-1.5">
              <p className="text-sm text-gray-80">Add more files</p>
              <div className="flex space-x-1.5 text-xs text-gray-50">
                <p>
                  {fileContext.files.length}{" "}
                  {fileContext.files.length > 1 ? "files" : "file"} added
                </p>
                <p className="font-bold text-gray-30">·</p>
                <p>{format(spaceRemaining)} remaining</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Empty({
  onClick,
  onTextClick,
}: {
  onClick: () => void;
  onTextClick: () => void;
}) {
  return (
    <div
      className="flex h-full flex-1 cursor-pointer select-none items-center justify-center py-20 lg:py-0"
      onClick={onClick}
    >
      <div className="flex">
        <PlusCircle size={48} className="text-primary" weight="fill" />
        <div className="ml-2">
          <h1 className="text-2xl font-medium text-gray-80">Upload files</h1>
          {/* div added to test onfolderlopen */}
          {/* <div onClick={onTextClick} className="z-50"> */}
          <h2 className="-mt-0.5 text-base leading-4 text-primary underline">
            or select a folder
          </h2>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    directory?: boolean;
    webkitdirectory?: boolean;
  }
}

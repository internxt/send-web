import { PlusCircle } from "phosphor-react";
import { ChangeEvent, MouseEvent, useContext, useRef } from "react";
import { FilesContext } from "../contexts/Files";
import { format } from "bytes";
import { MAX_BYTES_PER_SEND, MAX_ITEMS_PER_LINK } from "../constants";
import ItemsList from "./ItemList";

export default function FileArea({
  className = "",
  scroll,
}: {
  className?: string;
  scroll: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const fileContext = useContext(FilesContext);

  const onFileExplorerOpen = (e: MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  }

  const onFolderExplorerOpen = (e: MouseEvent) => {
    e.preventDefault();
    folderInputRef.current?.click();
  }

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files)
      fileContext.addFiles(Array.from(event.target.files));
  }

  const spaceRemaining = MAX_BYTES_PER_SEND - fileContext.totalFilesSize;

  return (
    <div className={`${className} flex flex-col`}>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={onInputChange}
        multiple={true}
      />
      <input
        type="file"
        className="hidden"
        ref={folderInputRef}
        onChange={onInputChange}
        multiple={true}
        directory=""
        webkitdirectory=""
      />
      {fileContext.itemList.length === 0 ? (
        <Empty onFileExplorerOpen={onFileExplorerOpen} onFolderExplorerOpen={onFolderExplorerOpen} />
      ) : (
        <>
          <div className="flex-1 bg-gray-1">
            <ItemsList
              items={fileContext.itemList}
              onRemoveItem={fileContext.removeItem}
              className={`h-auto bg-gray-1 py-3 px-5 ${scroll ? "overflow-y-auto" : ""} `} // ${existsFolders ? "pt-0" : ""}
            />
          </div>
          <div
            className="flex cursor-pointer select-none items-center bg-gray-1 px-5 py-2.5"
            onClick={onFileExplorerOpen}
          >
            <PlusCircle className="text-primary" size={28}></PlusCircle>
            <div className="ml-1.5">
              <p className="text-sm text-gray-80">Add more files</p>
              <div className="flex space-x-1.5 text-xs text-gray-50">
                <p>
                  {fileContext.totalFilesCount} / {MAX_ITEMS_PER_LINK} {fileContext.totalFilesCount > 1 ? "files" : "file"} added
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
  onFileExplorerOpen,
  onFolderExplorerOpen,
}: {
  onFileExplorerOpen: (e: MouseEvent) => void;
  onFolderExplorerOpen: (e: MouseEvent) => void;
}) {
  return (
    <div
      className="flex h-full flex-1 cursor-pointer select-none items-center justify-center py-20 lg:py-0"
      onClick={onFileExplorerOpen}
    >
      <div className="flex cursor-default p-3" onClick={(e) => { e.stopPropagation(); }}>
        <PlusCircle size={48} className="text-primary cursor-pointer" weight="fill" onClick={onFileExplorerOpen} />
        <div className="ml-2">
          <h1 className="text-2xl font-medium text-gray-80">Upload files</h1>
          <div onClick={onFolderExplorerOpen} className="cursor-pointer">
            <h2 className="-mt-0.5 text-base leading-4 text-primary underline">
              or select a folder
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    directory?: string;
    webkitdirectory?: string;
  }
}

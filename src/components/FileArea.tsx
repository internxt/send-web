import { PlusCircle } from "phosphor-react";
import { ChangeEvent, useContext, useRef } from "react";
import { FilesContext } from "../contexts/Files";
import { format } from "bytes";
import { MAX_BYTES_PER_SEND } from "../constants";
import FileList from "./FileList";

export default function FileArea({
  className = "",
  scroll,
}: {
  className?: string;
  scroll: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileContext = useContext(FilesContext);

  function openFileExplorer() {
    inputRef.current?.click();
  }
  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files)
      fileContext.addFiles(Array.from(event.target.files));
  }

  const spaceRemaining =
    MAX_BYTES_PER_SEND -
    fileContext.files.reduce((prev, current) => prev + current.size, 0);

  return (
    <div className={`${className} flex flex-col`}>
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        onChange={onInputChange}
        multiple
      />
      {fileContext.files.length === 0 && <Empty onClick={openFileExplorer} />}
      {fileContext.files.length !== 0 && (
        <>
          <FileList
            files={fileContext.files}
            onRemoveFile={fileContext.removeFile}
            className={`flex-1 bg-gray-1 py-3 px-5 ${
              scroll ? "overflow-y-auto" : ""
            }`}
          />

          <div
            className="flex cursor-pointer select-none items-center bg-gray-1 px-5 py-2.5"
            onClick={openFileExplorer}
          >
            <PlusCircle className="text-primary" size={28}></PlusCircle>
            <div className="ml-1.5">
              <p className="text-sm text-gray-80">Add more files</p>
              <div className="flex space-x-1.5 text-xs text-gray-50">
                <p>{fileContext.files.length} files added</p>
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

function Empty({ onClick }: { onClick: () => void }) {
  const maxBytesPerSendDisplay = format(MAX_BYTES_PER_SEND);
  return (
    <div
      className="flex h-full flex-1 cursor-pointer select-none items-center justify-center"
      onClick={onClick}
    >
      <div className="flex">
        <PlusCircle size={48} className="text-primary" weight="fill" />
        <div className="ml-2">
          <h1 className="text-2xl font-medium text-gray-80">Upload files</h1>
          <h2 className="-mt-0.5 text-sm text-gray-50">
            Up to {maxBytesPerSendDisplay}
          </h2>
        </div>
      </div>
    </div>
  );
}

import { File, Folder, PlusCircle } from "phosphor-react";
import {
  ChangeEvent,
  forwardRef,
  MouseEvent,
  ReactNode,
  useContext,
  useRef,
  useState,
} from "react";
import { FilesContext } from "../contexts/Files";
import { format } from "bytes";
import { MAX_BYTES_PER_SEND, MAX_ITEMS_PER_LINK } from "../constants";
import ItemsList from "./ItemList";
import Dropdown from "./Dropdown";

export default function FileArea({
  className = "",
  scroll,
}: {
  className?: string;
  scroll: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const dropdownMenuButtonRef = useRef<HTMLButtonElement>(null);
  const [fileInputKey, setFileInputKey] = useState<number>(Date.now());
  const [folderInputKey, setFolderInputKey] = useState<number>(Date.now());

  const fileContext = useContext(FilesContext);

  const onFileExplorerOpen = (e: MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const onFolderExplorerOpen = (e: MouseEvent) => {
    e.preventDefault();
    folderInputRef.current?.click();
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      fileContext.addFiles(Array.from(event.target.files));
    }
    if (dropdownMenuButtonRef.current?.ariaExpanded === "true") {
      dropdownMenuButtonRef.current?.click();
    }
    setFileInputKey(Date.now());
    setFolderInputKey(Date.now());
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const MenuItem = forwardRef(
    (
      {
        children,
        onClick,
      }: { children: ReactNode; onClick: (e: MouseEvent) => void },
      ref
    ) => {
      return (
        <div
          className="flex cursor-pointer items-center rounded-md px-3 py-1 text-gray-80 hover:bg-primary hover:text-white active:bg-primary-dark"
          onClick={onClick}
        >
          {children}
        </div>
      );
    }
  );

  const spaceRemaining = MAX_BYTES_PER_SEND - fileContext.totalFilesSize;

  return (
    <div className={`${className} flex flex-col overflow-hidden rounded-t-2xl`}>
      <input
        key={`file-${fileInputKey}`}
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={onInputChange}
        multiple={true}
      />
      <input
        key={`folder-${folderInputKey}`}
        type="file"
        className="hidden"
        ref={folderInputRef}
        onChange={onInputChange}
        multiple={true}
        directory=""
        webkitdirectory=""
      />
      {fileContext.itemList.length === 0 ? (
        <Empty
          onFileExplorerOpen={onFileExplorerOpen}
          onFolderExplorerOpen={onFolderExplorerOpen}
        />
      ) : (
        <>
          <ItemsList
            items={fileContext.itemList}
            onRemoveItem={fileContext.removeItem}
            className={`flex-1 bg-gray-1 px-5 py-3 ${
              scroll ? "overflow-y-auto" : ""
            } `}
          />

          <Dropdown
            buttonInputRef={dropdownMenuButtonRef}
            classButton={
              "flex flex-1 cursor-pointer select-none items-center bg-gray-1 px-5 py-2.5"
            }
            openDirection={"left"}
            classMenuItems={
              "left-0 w-max rounded-md border border-black border-opacity-8 bg-white drop-shadow dropdown"
            }
            menuItems={[
              <MenuItem onClick={onFolderExplorerOpen}>
                <Folder size={20} />
                <p className="ml-3">Folders</p>
              </MenuItem>,
              <MenuItem onClick={onFileExplorerOpen}>
                <File size={20} />
                <p className="ml-3">Files</p>
              </MenuItem>,
            ]}
          >
            <>
              <PlusCircle className="text-primary" size={28}></PlusCircle>
              <div className="ml-1.5">
                <p className="text-left text-sm text-gray-80">Add more items</p>
                <div className="flex space-x-1.5 text-xs text-gray-50">
                  <p>
                    {fileContext.totalFilesCount} / {MAX_ITEMS_PER_LINK}{" "}
                    {fileContext.totalFilesCount > 1 ? "files" : "file"} added
                  </p>
                  <p className="font-bold text-gray-30">·</p>
                  <p>{format(spaceRemaining)} remaining</p>
                </div>
              </div>
            </>
          </Dropdown>
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
      className="flex h-full flex-1 cursor-pointer select-none items-center justify-center"
      onClick={onFileExplorerOpen}
    >
      <div
        className="flex cursor-default p-3"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <PlusCircle
          size={48}
          className="cursor-pointer text-primary"
          weight="fill"
          onClick={onFileExplorerOpen}
        />
        <div className="ml-2">
          <h1 className="text-2xl font-medium text-gray-80">Upload files</h1>
          <div onClick={onFolderExplorerOpen} className="cursor-pointer">
            <h2 className="-mt-0.5 text-base leading-4 text-primary underline hover:no-underline">
              or select a folder
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    directory?: string;
    webkitdirectory?: string;
  }
}

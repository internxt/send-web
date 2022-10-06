import bytes from "bytes";
import { X } from "phosphor-react";

type ItemDetails = Pick<File, "name" | "size" | "type">;

export default function FileFolder({
  className = "",
  files,
  onRemoveFolder,
}: {
  className?: string;
  files: ItemDetails[];
  onRemoveFolder?: (folderName: string) => void;
}) {
  return (
    <div className={`${className}`}>
      {files.map((file, i) => (
        <Item
          key={file.name}
          file={file}
          onRemove={
            onRemoveFolder ? () => onRemoveFolder(file.name) : undefined
          }
        />
      ))}
    </div>
  );
}

function Item({
  file,
  onRemove,
}: {
  file: ItemDetails;
  onRemove?: () => void;
}) {
  return (
    <div className="group relative border-b border-gray-5 py-2.5">
      <h1 className="truncate text-base text-gray-80">{file.name}</h1>
      <div className="flex space-x-1.5 text-xs text-gray-50">
        <p>{bytes.format(file.size)}</p>
        <p className="font-bold text-gray-30">·</p>
        <p>folder</p>
      </div>
      {onRemove && (
        <button
          className="absolute right-0 top-0 flex h-full items-center justify-end bg-gradient-to-r from-transparent via-gray-1 to-gray-1 pl-12 lg:hidden lg:group-hover:flex"
          onClick={onRemove}
        >
          <X size={20} className="text-gray-80" />
        </button>
      )}
    </div>
  );
}

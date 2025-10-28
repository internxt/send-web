import bytes from "bytes";
import { X } from "phosphor-react";
import { SendItemData } from "../models/SendItem";

export default function ItemList({
  className = "",
  items,
  onRemoveItem,
}: {
  className?: string;
  items: SendItemData[];
  onRemoveItem?: (item: SendItemData) => void;
}) {
  return (
    <div className={`${className}`}>
      {items.map((item) => (
        <Item key={item.id} item={item} onRemove={onRemoveItem} />
      ))}
    </div>
  );
}

function Item({
  item,
  onRemove,
}: {
  item: SendItemData;
  onRemove?: (item: SendItemData) => void;
}) {
  const extension =
    item.type === "file" &&
    item.name.includes(".") &&
    item.name.split(".").pop();

  return (
    <div className="group relative border-b border-gray-5 py-2.5">
      <h1 className="truncate text-base text-gray-80">{item.name}</h1>
      <div className="flex space-x-1.5 text-xs text-gray-50">
        {item.type === "folder" && (
          <>
            <p>Folder</p>
            <p className="font-bold text-gray-30">·</p>
            {item.countFiles && (
              <>
                <p>
                  {item.countFiles} {item.countFiles === 1 ? "file" : "files"}
                </p>
                <p className="font-bold text-gray-30">·</p>
              </>
            )}
          </>
        )}
        <p>{bytes.format(item.size)}</p>
        {extension && (
          <>
            <p className="font-bold text-gray-30">·</p>
            <p>{extension}</p>
          </>
        )}
      </div>
      {onRemove && (
        <button
          className="absolute right-0 top-0 flex h-full items-center justify-end bg-linear-to-r from-transparent via-gray-1 to-gray-1 pl-12 lg:hidden lg:group-hover:flex"
          onClick={() => onRemove(item)}
        >
          <X size={20} className="text-gray-80" />
        </button>
      )}
    </div>
  );
}

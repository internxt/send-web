import { format } from "bytes";
import { ReactNode, useCallback, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { MAX_BYTES_PER_SEND } from "../constants";
import { FilesContext } from "../contexts/Files";

export default function RootDropzone({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const filesContext = useContext(FilesContext);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      filesContext.addFiles(acceptedFiles);
    },
    [filesContext]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    disabled: !filesContext.enabled,
    noKeyboard: true,
  });

  const maxBytesPerSendDisplay = format(MAX_BYTES_PER_SEND);

  return (
    <div className={className} {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive && (
        <div className="fade-in-animation fixed z-10 h-full w-full bg-white p-5 lg:bg-primary lg:p-20">
          <div className="flex h-full w-full items-center justify-center border-3 border-dashed border-gray-40 lg:rounded-2xl lg:border-white">
            <div className="text-center">
              <h1 className="text-3xl font-medium text-gray-40 lg:text-5xl lg:text-white">
                Drag and drop your files here
              </h1>
              <h2 className="mt-3  text-lg text-gray-40 lg:text-2xl lg:text-white">
                Maximum {maxBytesPerSendDisplay} upload limit
              </h2>
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

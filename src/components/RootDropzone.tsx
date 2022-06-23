import { ReactNode, useCallback, useContext } from "react";
import { useDropzone } from "react-dropzone";
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
  });

  return (
    <div className={className} {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive && (
        <div className="fixed z-10 h-full w-full bg-primary p-20">
          <div className="flex h-full w-full items-center justify-center rounded-[40px] border-4 border-dashed border-white">
            <div className="text-center">
              <h1 className="text-5xl font-medium text-white">Drop files</h1>
              <h2 className="mt-3 text-2xl text-white">
                Upload up to 2GB in total
              </h2>
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

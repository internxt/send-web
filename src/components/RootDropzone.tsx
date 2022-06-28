import { Transition } from "@headlessui/react";
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
      <Transition
        show={isDragActive}
        enter="transition-opacity duration-500 ease-in-out"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-0"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed z-10 h-full w-full bg-primary p-20">
          <div className="flex h-full w-full items-center justify-center rounded-[40px] border-4 border-dashed border-white">
            <div className="text-center">
              <h1 className="text-5xl font-medium text-white">Drop files</h1>
              <h2 className="mt-3 text-2xl text-white">
                Upload up to {maxBytesPerSendDisplay} in total
              </h2>
            </div>
          </div>
        </div>
      </Transition>
      {children}
    </div>
  );
}

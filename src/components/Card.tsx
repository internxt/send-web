import { ReactNode } from "react";

export default function Card({
  className = "",
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={`${className} h-full w-full overflow-hidden lg:rounded-2xl bg-white lg:w-96`}
    >
      {children}
    </div>
  );
}

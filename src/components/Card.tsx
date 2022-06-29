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
      className={`${className} h-full w-full overflow-hidden rounded-2xl bg-white lg:h-[640px] lg:w-96`}
    >
      {children}
    </div>
  );
}

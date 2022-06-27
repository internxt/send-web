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
      className={`${className} h-[540px] w-80 overflow-hidden rounded-2xl bg-white`}
    >
      {children}
    </div>
  );
}

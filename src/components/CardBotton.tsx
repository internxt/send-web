import { ReactNode } from "react";

export default function CardBottom({ children }: { children: ReactNode }) {
  return (
    <div className="w-full border-t border-gray-5 py-4 px-5">{children}</div>
  );
}

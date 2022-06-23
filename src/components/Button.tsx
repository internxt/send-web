import { ReactNode } from "react";

export default function Button({
  className = "",
  children,
  disabled,
  outline,
}: {
  className?: string;
  children: ReactNode;
  disabled?: boolean;
  outline?: boolean;
}) {
  const background = outline
    ? "bg-transparent"
    : "bg-primary active:bg-primary-dark disabled:bg-gray-40";

  const textColor = outline
    ? "text-primary active:text-primary-dark disabled:text-gray-40"
    : "text-white";

  const border = outline
    ? "border border-primary active:border-primary-dark disabled:border-gray-40"
    : "";

  return (
    <button
      disabled={disabled}
      className={`${className} ${background} ${textColor} ${border} h-11 w-full rounded-[100px] font-medium`}
    >
      {children}
    </button>
  );
}

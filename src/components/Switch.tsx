import { JSX } from "react";

export default function Switch<F extends string, S extends string>({
  className = "",
  options,
  onClick,
  value,
}: {
  className?: string;
  options: readonly [F, S];
  onClick: (value: F | S) => void;
  value: F | S;
}) {
  const first = options[0];
  const second = options[1];

  return (
    <div
      className={`relative flex h-9 w-full rounded-lg bg-gray-5 ${className}`}
    >
      <div
        className={`absolute h-full w-1/2 transform p-0.5 transition-transform ${
          value === first ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full w-full rounded-lg bg-white" />
      </div>
      <SwitchPart
        active={value === first}
        text={first}
        onClick={() => onClick(first)}
      />
      <SwitchPart
        active={value === second}
        text={second}
        onClick={() => onClick(second)}
      />
    </div>
  );
}

function SwitchPart({
  text,
  active,
  onClick,
}: {
  text: string;
  active: boolean;
  onClick?: () => void;
}): JSX.Element {
  return (
    <button
      className={`${
        active ? "text-gray-100" : "text-gray-50"
      } relative h-full w-1/2 text-sm font-medium`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

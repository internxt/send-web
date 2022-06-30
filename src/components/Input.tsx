import { WarningOctagon, Warning, CheckCircle } from "phosphor-react";

export default function Input({
  className = "",
  label,
  type = "text",
  accent,
  disabled,
  placeholder,
  value,
  onChange,
  message,
  onFocus,
  onBlur,
  onPaste,
  onKeyDown,
}: {
  className?: string;
  label?: string;
  variant?: "text" | "email";
  accent?: "error" | "warning" | "success";
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  onKeyDown?: React.KeyboardEventHandler;
  onPaste?: React.ClipboardEventHandler;
  onFocus?: () => void;
  onBlur?: () => void;
  message?: string;
  type?: string;
}): JSX.Element {
  let focusColor: string;

  switch (accent) {
    case "error":
      focusColor = "focus:border-red-std ring-red-std";
      break;
    case "warning":
      focusColor = "focus:border-orange ring-orange";
      break;
    case "success":
      focusColor = "focus:border-green ring-green";
      break;
    default:
      focusColor = "focus:border-primary ring-primary";
      break;
  }

  const borderColor =
    "border-gray-20 disabled:border-gray-10 hover:border-gray-30";

  const backgroundColor = "bg-white disabled:bg-white";

  const placeholderColor = "placeholder-gray-30";

  const padding = "px-3";

  const input = (
    <div className="relative">
      <input
        disabled={disabled}
        className={`inxt-input h-11 w-full rounded-md border text-lg font-normal text-gray-80 outline-none ring-opacity-10 focus:ring-2 disabled:text-gray-40 disabled:placeholder-gray-20 md:h-9 lg:text-base 
				${borderColor} ${focusColor} ${placeholderColor} ${backgroundColor} ${padding}`}
        type={type ?? "text"}
        placeholder={placeholder}
        onChange={(e) => onChange && onChange(e.target.value)}
        onFocus={() => {
          onFocus && onFocus();
        }}
        onBlur={() => {
          onBlur && onBlur();
        }}
        onPaste={onPaste}
        value={value}
        onKeyDown={onKeyDown}
      />
    </div>
  );

  let messageColor: string;
  let MessageIcon: typeof WarningOctagon | undefined;

  switch (accent) {
    case "success":
      messageColor = "text-green";
      MessageIcon = CheckCircle;
      break;
    case "warning":
      messageColor = "text-orange";
      MessageIcon = Warning;
      break;
    case "error":
      messageColor = "text-red-std";
      MessageIcon = WarningOctagon;
      break;
    default:
      messageColor = "text-gray-80";
  }

  return (
    <div className={`${className}`}>
      {label ? (
        <label
          className={`text-sm font-medium ${
            disabled ? "text-gray-40" : "text-gray-80"
          }`}
        >
          {label} {input}
        </label>
      ) : (
        input
      )}
      {message && (
        <div className={`mt-0.5 flex items-center ${messageColor}`}>
          {MessageIcon && <MessageIcon size={16} />}
          <p className="ml-1 text-[10px] font-normal text-gray-80">{message}</p>
        </div>
      )}
    </div>
  );
}

import isValidEmail from "@internxt/lib/dist/src/auth/isValidEmail";
import { X } from "phosphor-react";
import { useContext, useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import FileArea from "../components/FileArea";
import Input from "../components/Input";
import Switch from "../components/Switch";
import { MAX_RECIPIENTS } from "../constants";
import { FilesContext } from "../contexts/Files";
import logo from "../logo.svg";

type EmailFormState = {
  sendTo: string[];
  sender: string;
  title: string;
  message: string;
};

export default function HomeView() {
  const options = ["Send link", "Send email"] as const;
  const [switchValue, setSwitchValue] = useState<typeof options[number]>(
    options[0]
  );

  const [formState, setFormState] = useState<EmailFormState>({
    sendTo: [],
    sender: "",
    title: "",
    message: "",
  });

  const filesContext = useContext(FilesContext);

  const disableButton =
    filesContext.files.length === 0 ||
    (switchValue === "Send email" &&
      (formState.sendTo.length === 0 || !isValidEmail(formState.sender)));

  return (
    <div className="flex h-screen flex-col bg-black">
      <header className="flex h-20 items-center px-6">
        <img className="h-3" src={logo} alt="Internxt's logo" />
      </header>
      <div className="flex-1">
        <Card className="ml-20 mt-10 flex flex-col">
          <div
            className={`min-h-0 flex-1 ${
              switchValue === "Send email" ? "overflow-auto" : ""
            }`}
          >
            <FileArea
              className={
                switchValue === "Send email" ? "min-h-[224px]" : "h-full"
              }
              scroll={switchValue === "Send link"}
            />
            {switchValue === "Send email" && (
              <EmailForm value={formState} onChange={setFormState} />
            )}
          </div>
          <div className="border-t border-gray-5 py-4 px-5">
            <Switch
              options={options}
              onClick={setSwitchValue}
              value={switchValue}
            />
            <Button disabled={disableButton} className="mt-4">
              {switchValue === "Send link" ? "Get a link" : "Send files"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function EmailForm({
  value,
  onChange,
}: {
  value: EmailFormState;
  onChange: (v: EmailFormState) => void;
}) {
  return (
    <div className="border-t border-gray-5 px-5 py-4">
      <SendTo
        value={value.sendTo}
        onChange={(v) => onChange({ ...value, sendTo: v })}
      />
      <Input
        placeholder="My email address"
        label="Your email"
        onChange={(v) => onChange({ ...value, sender: v })}
        value={value.sender}
      />
      <label className={`mt-4 block text-sm font-medium text-gray-80`}>
        Transfer info
        <span className="text-xs font-normal text-gray-40"> (optional)</span>
        <Input
          placeholder="Title"
          onChange={(v) => onChange({ ...value, title: v })}
          value={value.title}
        />
      </label>
      <textarea
        className="mt-1 h-20 w-full resize-none rounded-md border border-gray-20 bg-white px-3 py-2 text-sm font-normal text-gray-80 placeholder-gray-30 
				outline-none ring-primary ring-opacity-10 hover:border-gray-30 focus:border-primary focus:ring-2"
        placeholder="Message"
        onChange={(v) => onChange({ ...value, message: v.target.value })}
        value={value.message}
      />
    </div>
  );
}

function SendTo({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [inputValue, setInputValue] = useState("");

  function onInputChange(newInputValue: string) {
    const noWhitespacesInput = newInputValue.replace(/\s/g, "");
    const thereAreCommas = noWhitespacesInput.includes(",");

    if (!thereAreCommas) {
      setInputValue(noWhitespacesInput);
      return;
    }

    const valuesBetweenCommas = noWhitespacesInput.split(",");

    const newValidEmails = valuesBetweenCommas.filter((email) => {
      const isValid = isValidEmail(email);
      const isAlreadyInList = value.find((e) => e === email);

      return isValid && !isAlreadyInList;
    });

    setInputValue("");
    onChange([...value, ...newValidEmails]);
  }

  function onRemoveEmail(index: number) {
    onChange(value.filter((_, i) => index !== i));
  }

  const maxRecipientsReached = value.length >= MAX_RECIPIENTS;

  return (
    <div>
      <label className={`mt-4 block text-sm font-medium text-gray-80`}>
        Send to
        <ul>
          {value.map((email, i) => (
            <li
              key={email}
              className="group relative mt-1 w-max max-w-full truncate rounded-[100px] bg-gray-5 px-3 py-1 text-xs font-medium text-gray-80"
            >
              {email}
              <div
                onClick={() => onRemoveEmail(i)}
                className="absolute right-0 top-1/2 hidden -translate-y-1/2 cursor-pointer bg-gradient-to-r from-transparent via-gray-5 to-gray-5 pr-2.5 pl-6 group-hover:block"
              >
                <X size={14} />
              </div>
            </li>
          ))}
        </ul>
        <Input
          onChange={onInputChange}
          value={inputValue}
          className="mt-1"
          placeholder="Send files to..."
          message={
            maxRecipientsReached
              ? `You can have up to ${MAX_RECIPIENTS} recipients`
              : "Separate multiple emails with commas"
          }
          disabled={maxRecipientsReached}
          accent={maxRecipientsReached ? "warning" : undefined}
        />
      </label>
    </div>
  );
}

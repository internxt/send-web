import isValidEmail from "@internxt/lib/dist/src/auth/isValidEmail";
import { format } from "bytes";
import copy from "copy-to-clipboard";
import { CheckCircle, X, XCircle } from "phosphor-react";
import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import FancySpinner from "../components/FancySpinner";
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

  const [phase, setPhase] = useState<
    | { name: "standby" }
    | { name: "loading" | "confirm_cancel"; uploadedBytes: number }
    | { name: "done"; link: string }
    | { name: "error" }
  >({ name: "standby" });

  const [formState, setFormState] = useState<EmailFormState>({
    sendTo: [],
    sender: "",
    title: "",
    message: "",
  });

  const filesContext = useContext(FilesContext);

  useEffect(() => {
    filesContext.setEnabled(phase.name === "standby");
  }, [phase, filesContext]);

  const totalSize = filesContext.files.reduce(
    (prev, current) => prev + current.size,
    0
  );

  const disableButton =
    filesContext.files.length === 0 ||
    (switchValue === "Send email" &&
      (formState.sendTo.length === 0 || !isValidEmail(formState.sender)));

  function simulateUpload(cb: (progress: number) => void) {
    return new Promise((resolve, reject) => setTimeout(reject, 10000));
  }

  async function onSubmit() {
    setPhase({ name: "loading", uploadedBytes: 0 });
    try {
      await simulateUpload((progress) => {});
      setPhase({ name: "done", link: "" });
    } catch {
      setPhase({ name: "error" });
    }
  }

  const linkRef = useRef<HTMLDivElement>(null);

  function copyLink() {
    if (phase.name === "done") {
      copy(phase.link);
      const selection = window.getSelection();
      if (selection && linkRef.current) {
        const range = document.createRange();
        range.selectNodeContents(linkRef.current);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  return (
    <div className="flex h-screen flex-col bg-black">
      <header className="flex h-20 items-center px-6">
        <img className="h-3" src={logo} alt="Internxt's logo" />
      </header>
      <div className="flex-1">
        <Card className="ml-20 mt-10 flex flex-col">
          {phase.name === "standby" && (
            <>
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
              <CardBottom>
                <Switch
                  options={options}
                  onClick={setSwitchValue}
                  value={switchValue}
                />
                <Button
                  disabled={disableButton}
                  className="mt-4"
                  onClick={onSubmit}
                >
                  {switchValue === "Send link" ? "Get a link" : "Send files"}
                </Button>
              </CardBottom>
            </>
          )}
          {(phase.name === "loading" || phase.name === "confirm_cancel") && (
            <div className="flex h-full flex-col">
              <div className="flex flex-1 flex-col items-center">
                <FancySpinner
                  className="mt-20"
                  progress={Math.floor((phase.uploadedBytes / totalSize) * 100)}
                />
                <div className="mt-10 text-center">
                  {phase.name === "loading" ? (
                    <>
                      <p className="text-xl font-medium text-gray-80">
                        {switchValue === "Send email" ? "Sending" : "Uploading"}{" "}
                        {filesContext.files.length} files
                      </p>
                      <p className="mt-1.5 text-gray-60">
                        {format(phase.uploadedBytes)} of {format(totalSize)}{" "}
                        uploaded
                      </p>
                    </>
                  ) : (
                    <p className="w-64 text-xl font-medium text-gray-80">
                      Are you sure you want to cancel this transfer?
                    </p>
                  )}
                </div>
              </div>
              <CardBottom>
                {phase.name === "loading" ? (
                  <Button
                    outline
                    onClick={() =>
                      setPhase({
                        name: "confirm_cancel",
                        uploadedBytes: phase.uploadedBytes,
                      })
                    }
                  >
                    Cancel
                  </Button>
                ) : (
                  <div className="flex">
                    <Button
                      outline
                      onClick={() =>
                        setPhase({
                          name: "loading",
                          uploadedBytes: phase.uploadedBytes,
                        })
                      }
                    >
                      No
                    </Button>
                    <Button
                      className="ml-4"
                      onClick={() => setPhase({ name: "standby" })}
                    >
                      Yes
                    </Button>
                  </div>
                )}
              </CardBottom>
            </div>
          )}
          {phase.name === "done" && (
            <div className="flex h-full flex-col">
              <div className="flex flex-1 flex-col items-center">
                <CheckCircle
                  className="mt-20 text-green"
                  weight="fill"
                  size={140}
                />
                <div className="mt-20 w-full px-5 text-center">
                  <p className="text-xl font-medium text-gray-80">
                    {switchValue === "Send email"
                      ? "Files sent via email"
                      : `${filesContext.files.length} files uploaded`}
                  </p>
                  <p className="text-gray-60">
                    {switchValue === "Send email"
                      ? "File access will expire in 2 weeks"
                      : "This link will expire in 2 weeks"}
                  </p>
                  {switchValue === "Send link" && (
                    <div
                      ref={linkRef}
                      className="mt-3 flex h-11 w-full items-center justify-center rounded-lg bg-gray-5 px-3 text-gray-80"
                      onClick={copyLink}
                    >
                      {phase.link}
                    </div>
                  )}
                </div>
              </div>
              <CardBottom>
                <Button
                  onClick={() => {
                    if (switchValue === "Send email") {
                      setPhase({ name: "standby" });
                      setFormState({
                        message: "",
                        sender: "",
                        sendTo: [],
                        title: "",
                      });
                      filesContext.clear();
                    } else {
                      copyLink();
                    }
                  }}
                >
                  {switchValue === "Send email"
                    ? "Send more files"
                    : "Copy link"}
                </Button>
              </CardBottom>
            </div>
          )}
          {phase.name === "error" && (
            <div className="flex h-full flex-col">
              <div className="flex flex-1 flex-col items-center">
                <XCircle
                  className="mt-20 text-red-std"
                  weight="fill"
                  size={140}
                />
                <div className="mt-20 w-full px-5 text-center">
                  <p className="text-xl font-medium text-gray-80">
                    Something went wrong...
                  </p>
                  <p className="text-gray-60">
                    We were unable to{" "}
                    {switchValue === "Send email" ? "send" : "upload"} your
                    files.
                    <br />
                    Please try again later.
                  </p>
                </div>
              </div>
              <CardBottom>
                <div className="flex">
                  <Button
                    outline
                    onClick={() =>
                      setPhase({
                        name: "standby",
                      })
                    }
                  >
                    Back
                  </Button>
                  <Button className="ml-4" onClick={onSubmit}>
                    Try again
                  </Button>
                </div>
              </CardBottom>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function CardBottom({ children }: { children: ReactNode }) {
  return <div className="border-t border-gray-5 py-4 px-5">{children}</div>;
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

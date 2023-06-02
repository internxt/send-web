import isValidEmail from "@internxt/lib/dist/src/auth/isValidEmail";
import { format } from "bytes";
import copy from "copy-to-clipboard";
import throttle from "lodash.throttle";
import { Check, Copy, X } from "phosphor-react";
import { useContext, useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import CardBottom from "../components/CardBotton";
import FancySpinner from "../components/FancySpinner";
import FileArea from "../components/FileArea";
import Input from "../components/Input";
import Switch from "../components/Switch";
import { MAX_RECIPIENTS } from "../constants";
import { FilesContext } from "../contexts/Files";
import Layout from "../Layout";
import notificationsService, {
  ToastType,
} from "../services/notifications.service";
import { UploadService } from "../services/upload.service";
import * as Sentry from "@sentry/react";
import { getAllItemsArray } from "../services/items.service";
import FeatureSection from "../components/send/FeatureSection";
import InfoSection from "../components/send/InfoSection";
import FaqSection from "../components/send/FaqSection";
import Footer from "../components/footer/Footer";

import schemaMarkup from "../assets/lang/en/send.json";
import { sm_faq } from "../components/utils/schema-markup-generator";
import CtaSection from "../components/send/CtaSection";

type EmailFormState = {
  sendTo: string[];
  sender: string;
  title: string;
  message: string;
  sendToField: string;
};

export default function HomeView() {
  const options = ["Send link", "Send email"] as const;
  const uploadAbortController = useRef<AbortController | null>(null);
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
    sendToField: "",
  });

  const filesContext = useContext(FilesContext);

  useEffect(() => {
    filesContext.setEnabled(phase.name === "standby");
  }, [phase, filesContext]);

  const disableButton =
    filesContext.totalFilesCount === 0 ||
    (switchValue === "Send email" &&
      ((formState.sendTo.length === 0 &&
        !isValidEmail(formState.sendToField)) ||
        !isValidEmail(formState.sender)));

  async function uploadFiles(cb: (progress: number) => void) {
    const abortController = new AbortController();
    uploadAbortController.current = abortController;

    const items = getAllItemsArray(filesContext.itemList);

    const link = await UploadService.uploadFilesAndGetLink(
      items,
      switchValue === "Send email"
        ? {
            sender: formState.sender,
            receivers:
              formState.sendTo.length === 0
                ? [formState.sendToField]
                : formState.sendTo,
            subject: formState.message,
            title: formState.title,
          }
        : undefined,
      {
        progress: (_, uploadedBytes) => cb(uploadedBytes),
        abortController,
      }
    );

    return link;
  }

  function cancelUpload() {
    if (phase.name !== "loading") {
      return;
    }

    setPhase({
      name: "confirm_cancel",
      uploadedBytes: phase.uploadedBytes,
    });
  }

  async function onSubmit() {
    setPhase({ name: "loading", uploadedBytes: 0 });
    try {
      const link = await uploadFiles((uploadedBytes) => {
        setPhase((phase) => {
          if (phase.name === "loading" || phase.name === "confirm_cancel")
            return { name: phase.name, uploadedBytes };
          else return phase;
        });
      });
      setPhase({ name: "done", link });
    } catch (err) {
      console.error(err);

      if (!uploadAbortController.current?.signal.aborted) {
        setPhase({ name: "error" });
        Sentry.captureException(err);
      }
    }
  }

  function copyLink() {
    if (phase.name === "done") {
      copy(phase.link);
      notificationsService.show({
        type: ToastType.Success,
        text: "Link copied to your clipboard",
      });
    }
  }

  const copyLinkThrottled = throttle(copyLink, 5000);

  return (
    <div className="flex w-full flex-col overflow-hidden">
      <Layout>
        {phase.name === "standby" && (
          <>
            <div
              className={`flex min-h-0 flex-1 flex-col justify-center md:justify-start ${
                switchValue === "Send email"
                  ? "overflow-hidden overflow-y-auto lg:rounded-t-2xl"
                  : ""
              }`}
            >
              <FileArea
                className={`min-h-[224px] ${
                  switchValue !== "Send email" && "lg:h-full"
                }`}
                scroll={switchValue === "Send link"}
              />
              {switchValue === "Send email" && (
                <EmailForm value={formState} onChange={setFormState} />
              )}
            </div>
            <div className="min-h-auto flex w-full">
              <CardBottom>
                <Switch
                  className="mx-auto"
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
            </div>
          </>
        )}
        {(phase.name === "loading" || phase.name === "confirm_cancel") && (
          <div className="flex h-full flex-col">
            <div className="flex flex-1 flex-col items-center">
              <FancySpinner
                className="mt-20"
                progress={Math.floor(
                  (phase.uploadedBytes / filesContext.totalFilesSize) * 100
                )}
              />
              <div className="mt-10 text-center">
                {phase.name === "loading" ? (
                  <>
                    <p className="text-xl font-medium text-gray-80">
                      {switchValue === "Send email" ? "Sending" : "Uploading"}{" "}
                      {filesContext.totalFilesCount}{" "}
                      {filesContext.totalFilesCount > 1 ? "files" : "file"}
                    </p>
                    <p className="mt-1.5 text-gray-60">
                      {format(phase.uploadedBytes)} of{" "}
                      {format(filesContext.totalFilesSize)} uploaded
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
                <Button outline onClick={cancelUpload}>
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
                    onClick={() => {
                      uploadAbortController.current?.abort();
                      setPhase({ name: "standby" });
                    }}
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
              <div className="mt-20 flex h-28 w-28 flex-row items-center justify-center rounded-full bg-green text-white">
                <Check size={80} />
              </div>
              <div className="mt-20 w-full px-5 text-center">
                <p className="text-xl font-medium text-gray-80">
                  {switchValue === "Send email"
                    ? "Files sent via email"
                    : `${filesContext.totalFilesCount} ${
                        filesContext.totalFilesCount > 1 ? "files" : "file"
                      } uploaded`}
                </p>
                <p className="text-gray-60">
                  {switchValue === "Send email"
                    ? "File access will expire in 2 weeks"
                    : "This link will expire in 2 weeks"}
                </p>
                {switchValue === "Send link" && (
                  <Button
                    className="mx-auto mt-4 flex w-auto flex-row items-center justify-center space-x-2 px-7"
                    onClick={() => {
                      copyLinkThrottled();
                    }}
                  >
                    <Copy className="text-white" size={24} />
                    <span>Copy link</span>
                  </Button>
                )}
              </div>
            </div>
            <CardBottom>
              <Button
                outline
                onClick={() => {
                  setPhase({ name: "standby" });
                  setFormState({
                    message: "",
                    sender: "",
                    sendTo: [],
                    title: "",
                    sendToField: "",
                  });
                  filesContext.clear();
                }}
              >
                Send more files
              </Button>
            </CardBottom>
          </div>
        )}
        {phase.name === "error" && (
          <div className="flex h-full flex-col">
            <div className="flex flex-1 flex-col items-center">
              <div className="mt-20 flex h-28 w-28 flex-row items-center justify-center rounded-full bg-red-std text-white">
                <X size={80} />
              </div>
              <div className="mt-20 w-full px-5 text-center">
                <p className="text-xl font-medium text-gray-80">
                  Something went wrong...
                </p>
                <p className="text-gray-60">
                  We were unable to{" "}
                  {switchValue === "Send email" ? "send" : "upload"} your files.
                  <br />
                  "Please try again later."
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
      </Layout>
      <FeatureSection />
      <InfoSection />
      <FaqSection />
      <CtaSection />
      <Footer />

      <script type="application/ld+json" data-nscript="beforeInteractive">
        {sm_faq(schemaMarkup.SchemaMarkupQuestions.faq)}
      </script>
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
  const { sendTo, sendToField } = value;
  return (
    <div className="border-t border-gray-5 px-5">
      <SendTo
        value={{ sendTo, sendToField }}
        onChange={(v) => onChange({ ...value, ...v })}
      />
      <Input
        type="email"
        placeholder="My email address"
        label="Your email"
        onChange={(v) => onChange({ ...value, sender: v })}
        value={value.sender}
        onKeyDown={(e) => {
          if (e.key === " ") e.preventDefault();
        }}
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
        className="mt-1 h-20 w-full resize-none rounded-md border border-gray-20 bg-white px-3 py-2 text-lg font-normal text-gray-80 placeholder-gray-30 outline-none 
      ring-primary ring-opacity-10 hover:border-gray-30 focus:border-primary focus:ring-2 lg:text-base"
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
  value: { sendTo: string[]; sendToField: string };
  onChange: (v: { sendTo: string[]; sendToField: string }) => void;
}) {
  function onRemoveEmail(index: number) {
    onChange({ ...value, sendTo: value.sendTo.filter((_, i) => index !== i) });
  }

  const onKeyDown: React.KeyboardEventHandler = (event) => {
    if (event.key === "Enter" || event.key === "," || event.key === " ") {
      event.preventDefault();
      if (emailFilter(value.sendToField)) {
        onChange({
          sendToField: "",
          sendTo: [...value.sendTo, value.sendToField],
        });
      } else if (isAlreadyInList(value.sendToField)) {
        onChange({ ...value, sendToField: "" });
      }
    }
  };

  function onInputChange(newText: string) {
    if (Math.abs(newText.length - value.sendToField.length) === 1) {
      onChange({ ...value, sendToField: newText });
    }
  }

  function isAlreadyInList(email: string) {
    return value.sendTo.find((e) => e === email);
  }

  function emailFilter(email: string) {
    const isValid = isValidEmail(email);
    const alreadyInList = isAlreadyInList(email);

    return isValid && !alreadyInList;
  }

  const onPaste: React.ClipboardEventHandler = (event) => {
    const text = event.clipboardData.getData("text");

    const noWhitespacesInput = text.replace(/[\s,]+/g, ",");
    const thereAreCommas = noWhitespacesInput.includes(",");

    if (!thereAreCommas) {
      onChange({ ...value, sendToField: noWhitespacesInput });
      return;
    }

    const valuesBetweenCommas = noWhitespacesInput.split(",");

    const newValidEmails = valuesBetweenCommas.filter(emailFilter);

    onChange({ sendToField: "", sendTo: [...value.sendTo, ...newValidEmails] });
  };

  const maxRecipientsReached = value.sendTo.length >= MAX_RECIPIENTS;

  return (
    <div>
      <label className={`mt-4 block text-sm font-medium text-gray-80`}>
        Send to
        <ul className="mb-2 mt-1 space-y-1.5">
          {value.sendTo.map((email, i) => (
            <li
              key={email}
              className="group relative w-max max-w-full truncate rounded-full bg-gray-5 px-3.5 py-1.5 pr-9 text-sm font-medium text-gray-80 lg:py-1 lg:pr-3.5"
            >
              {email}
              <div
                onClick={() => onRemoveEmail(i)}
                className="absolute right-0 top-0 flex h-full cursor-pointer flex-row items-center pl-12 pr-2.5 lg:hidden lg:bg-gradient-to-r lg:from-transparent lg:via-gray-5 lg:to-gray-5 lg:group-hover:block"
              >
                <div className="flex h-full flex-row items-center">
                  <X size={14} />
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Input
          type="email"
          onKeyDown={onKeyDown}
          value={value.sendToField}
          onChange={onInputChange}
          className="mt-1"
          placeholder="Send files to..."
          message={
            maxRecipientsReached
              ? `You can have up to ${MAX_RECIPIENTS} recipients`
              : "Separate multiple emails with commas"
          }
          disabled={maxRecipientsReached}
          accent={maxRecipientsReached ? "warning" : undefined}
          onPaste={onPaste}
        />
      </label>
    </div>
  );
}

import { AxiosError } from "axios";
import { format } from "bytes";
import { ArrowDown, Check, X } from "phosphor-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import CardBottom from "../components/CardBotton";
import FancySpinner from "../components/FancySpinner";
import Spinner from "../components/Spinner";
import ItemsList from "../components/ItemList";
import Layout from "../Layout";
import {
  DownloadService,
  getSendLink,
  GetSendLinkResponse,
} from "../services/download.service";
import * as Sentry from "@sentry/react";
import { SendItemData } from "../models/SendItem";
import { getAllItemsList } from "../services/items.service";
import { ProgressOptions } from "../services/network.service";
import SendBanner from "../components/SendBanner";
import moment from "moment";

export default function DownloadView() {
  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "ready"; details: GetSendLinkResponse }
    | { status: "error"; reason: "not_found" | "unknown" }
    | { status: "done" }
    | { status: "downloading"; totalBytes: number; downloadedBytes: number }
  >({ status: "loading" });
  const [fileList, setFileList] = useState<SendItemData[]>([]);
  const [sendBannerVisible, setSendBannerVisible] = useState(false);

  const expireDate =
    state.status === "ready" &&
    moment(state.details.expirationAt).format("MMMM DD[,] YYYY");

  const params = useParams();
  const [search] = useSearchParams();

  const router = useNavigate();

  async function fetchDetails() {
    setState({ status: "loading" });
    try {
      if (!params.shareId) throw new Error();

      const details = await getSendLink(params.shareId);
      setFileList(details.items.filter((item) => item.type === "file"));
      setState({ status: "ready", details });
    } catch (err) {
      console.error(err);
      Sentry.captureException(err);
      if (err instanceof AxiosError && err.response?.status === 404) {
        setState({ status: "error", reason: "not_found" });
      }
      setState({ status: "error", reason: "unknown" });
    }
  }

  useEffect(() => {
    fetchDetails();
  }, []);

  async function onDownload() {
    if (state.status !== "ready") return;

    setState({
      status: "downloading",
      totalBytes: state.details.size,
      downloadedBytes: 0,
    });
    try {
      await DownloadService.downloadFilesFromLink(state.details.id, {
        totalBytes: state.details.size,
        progress: (totalBytes, downloadedBytes) => {
          setState({ status: "downloading", totalBytes, downloadedBytes });
        },
        plainCode: search.get("code") || undefined,
      } as ProgressOptions);
      setState({ status: "done" });
      setTimeout(() => {
        setSendBannerVisible(true);
      }, 3000);
    } catch (err) {
      console.error(err);
      Sentry.captureException(err);
      setState({ status: "error", reason: "unknown" });
    }
  }

  return (
    <Layout>
      {state.status === "loading" && (
        <div className="fixed flex h-screen w-screen flex-row items-center justify-center overflow-hidden pb-32">
          <Spinner className="mt-16 h-10 w-10" />
        </div>
      )}
      {state.status === "ready" && (
        <div className="flex h-full flex-col items-center">
          <div className="relative min-h-0 w-full flex-1 overflow-auto">
            <div className="flex flex-col bg-white">
              <div className="mx-auto mt-10 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <ArrowDown size={64} className="text-primary " />
              </div>
              <h1 className="mt-4 px-5 text-center text-xl font-semibold text-gray-80">
                {state.details.title ??
                  `${fileList.length} ${
                    fileList.length === 1 ? "File" : "Files"
                  }`}
              </h1>
              {state.details.subject && (
                <p className="px-5 text-center text-gray-60">
                  {state.details.subject}
                </p>
              )}
              <p className="mb-8 px-5 text-center text-sm text-gray-50">
                Link expires in {expireDate}
              </p>
            </div>

            <div className="w-full border-t border-gray-5 py-4 px-5">
              <p className="text-lg font-medium text-gray-80">
                {`${fileList.length} ${
                  fileList.length === 1 ? "file" : "files"
                }`}
              </p>
              <p className="text-sm text-gray-50">
                {format(state.details.size)} in total
              </p>
              <ItemsList
                className="mt-4"
                items={getAllItemsList(state.details.items)}
              />
            </div>
          </div>
          <CardBottom>
            <Button onClick={onDownload}>
              Download {fileList.length}{" "}
              {fileList.length === 1 ? "file" : "files"}
            </Button>
          </CardBottom>
        </div>
      )}
      {state.status === "downloading" && (
        <div className="flex h-full flex-col">
          <div className="flex flex-1 flex-col items-center">
            <FancySpinner
              className="mt-20"
              progress={Math.floor(
                (state.downloadedBytes / state.totalBytes) * 100
              )}
            />
            <div className="mt-10 text-center">
              <p className="text-xl font-medium text-gray-80">Downloading</p>
              <p className="mt-1.5 text-gray-60">
                {format(state.downloadedBytes)} of {format(state.totalBytes)}{" "}
                downloaded
              </p>
            </div>
          </div>
        </div>
      )}
      {state.status === "done" && (
        <div className="flex h-full flex-col">
          <div className="flex flex-1 flex-col items-center">
            <div className="mt-20 flex h-28 w-28 flex-row items-center justify-center rounded-full bg-green text-white">
              <Check size={80} />
            </div>
            <div className="mt-20 w-full px-5 text-center">
              <p className="text-xl font-medium text-gray-80">
                Download completed
              </p>
            </div>
          </div>
          <CardBottom>
            <Button
              onClick={() => {
                router("/");
              }}
            >
              Create another send
            </Button>
          </CardBottom>
        </div>
      )}
      {state.status === "error" && (
        <div className="flex h-full flex-col">
          <div className="flex flex-1 flex-col items-center">
            <div className="mt-20 flex h-28 w-28 flex-row items-center justify-center rounded-full bg-red-std text-white">
              <X size={80} />
            </div>
            <div className="mt-20 w-full px-5 text-center">
              <p className="text-xl font-medium text-gray-80">
                {state.reason === "not_found"
                  ? "This link has expired"
                  : "Something went wrong..."}
              </p>
            </div>
          </div>
          <CardBottom>
            <Button
              onClick={() => {
                router("/");
              }}
            >
              Create another send
            </Button>
          </CardBottom>
        </div>
      )}
      <SendBanner
        sendBannerVisible={sendBannerVisible}
        setIsSendBannerVisible={setSendBannerVisible}
      />
    </Layout>
  );
}

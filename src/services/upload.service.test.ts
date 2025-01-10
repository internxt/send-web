import { vi, describe, it, expect, beforeEach, Mock } from "vitest";
import { getCaptchaToken } from "../lib/auth";
import {
  CreateSendLinksResponse,
  SendLink,
  UploadService,
} from "./upload.service";
import { FileWithPath } from "react-dropzone";
import { SendItemData } from "../models/SendItem";
import axios from "axios";

vi.mock("axios");

vi.mock("../lib/auth", () => ({
  getCaptchaToken: vi.fn().mockResolvedValue("mock-token"),
}));

vi.mock("./upload.service", async () => {
  const mod = await vi.importActual<typeof import("./upload.service")>(
    "./upload.service"
  );
  return {
    ...mod,
  };
});

const mockSendLink: SendLink = {
  id: "mock-id-12345",
  name: "example-file.txt",
  type: "file",
  size: 1024,
  networkId: "network-id-67890",
  encryptionKey: "encryption-key-abcdef",
  parent_folder: null,
};

const mockSendLinkFolder: SendLink = {
  id: "mock-id-54321",
  name: "example-folder",
  type: "folder",
  size: 0,
  networkId: "network-id-09876",
  encryptionKey: "encryption-key-zyxwvu",
  parent_folder: "parent-folder-id",
};

const mockCreateSendLinksResponse: CreateSendLinksResponse = {
  id: "mock-id-12345",
  title: "Example Send Link",
  subject: "Example Subject",
  code: "mock-code-abcdef",
  sender: "mock-sender@example.com",
  receivers: ["receiver1@example.com", "receiver2@example.com"],
  views: 5,
  userId: 42,
  items: [
    {
      id: "item-id-1",
      name: "example-file.txt",
      type: "file",
      size: 1024, // 1 KB
      networkId: "network-id-67890",
      encryptionKey: "encryption-key-abcdef",
      parent_folder: null,
    },
    {
      id: "item-id-2",
      name: "example-folder",
      type: "folder",
      size: 0,
      networkId: "network-id-09876",
      encryptionKey: "encryption-key-zyxwvu",
      parent_folder: "parent-folder-id",
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  expirationAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
};

beforeEach(() => {
  vi.clearAllMocks();
  (getCaptchaToken as Mock).mockResolvedValue("mock-token");
  (axios.post as Mock).mockResolvedValue({ data: mockCreateSendLinksResponse });
});

describe("upload.service", () => {
  it("When the uploadFiles() is done, then should call storeSendLinks() and ensure getCaptchaToken() is called once", async () => {
    const uploadFilesSpy = vi.spyOn(UploadService, "uploadFiles");
    const storeSendLinksSpy = vi.spyOn(UploadService, "storeSendLinks");

    const axiosPostSpy = vi.spyOn(axios, "post");

    uploadFilesSpy.mockResolvedValue([mockSendLink, mockSendLinkFolder]);

    const result = await UploadService.uploadFilesAndGetLink([
      {
        id: "1",
        name: "file1.txt",
        type: "file",
        size: 100,
        file: {} as unknown as FileWithPath,
      } as unknown as SendItemData,
      {
        id: "2",
        name: "file2.txt",
        type: "file",
        size: 200,
        file: {} as unknown as FileWithPath,
      } as unknown as SendItemData,
    ]);

    expect(uploadFilesSpy).toHaveBeenCalledTimes(1);
    expect(getCaptchaToken).toHaveBeenCalledTimes(1);
    expect(storeSendLinksSpy).toHaveBeenCalledTimes(1);
    expect(storeSendLinksSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        items: expect.any(Array),
        code: expect.any(String),
        mnemonic: expect.any(String),
        plainCode: expect.any(String),
      })
    );
    expect(axiosPostSpy).toHaveBeenCalledTimes(1);
    expect(uploadFilesSpy.mock.invocationCallOrder[0]).toBeLessThan(
      (getCaptchaToken as Mock).mock.invocationCallOrder[0]
    );
    expect((getCaptchaToken as Mock).mock.invocationCallOrder[0]).toBeLessThan(
      axiosPostSpy.mock.invocationCallOrder[0]
    );
    expect(result).toContain("/download/");
    expect(result).toContain("?code=");
  });

  it("When storeSendLinks() is called, then getCaptchaToken() should be called before all", async () => {
    const storeSendLinksSpy = vi.spyOn(UploadService, "storeSendLinks");
    vi.spyOn(UploadService, "uploadFiles").mockResolvedValue([mockSendLink]);
    const axiosPostSpy = vi.spyOn(axios, "post");

    await UploadService.uploadFilesAndGetLink([
      {
        id: "1",
        name: "file1.txt",
        type: "file",
        size: 100,
        file: {} as unknown as FileWithPath,
      } as unknown as SendItemData,
    ]);

    expect(getCaptchaToken).toHaveBeenCalled();
    expect(storeSendLinksSpy).toHaveBeenCalled();
    expect(storeSendLinksSpy.mock.invocationCallOrder[0]).toBeLessThan(
      (getCaptchaToken as Mock).mock.invocationCallOrder[0]
    );
    expect((getCaptchaToken as Mock).mock.invocationCallOrder[0]).toBeLessThan(
      axiosPostSpy.mock.invocationCallOrder[0]
    );
  });
});

import { vi, describe, expect, beforeEach, Mock, test } from 'vitest';
import { getCaptchaToken } from '../lib/auth';
import { UploadService } from './upload.service';
import { FileWithPath } from 'react-dropzone';
import { SendItemData } from '../models/SendItem';
import { v4 } from 'uuid';
import { CreateSendLinksResponse, SendLink } from '@internxt/sdk/dist/send/types';
import { SdkManager } from './sdk-manager.service';

vi.mock('../lib/auth', () => ({
  getCaptchaToken: vi.fn().mockResolvedValue('mock-token'),
}));

vi.mock('./upload.service', async () => {
  const mod = await vi.importActual<typeof import('./upload.service')>('./upload.service');
  return {
    ...mod,
  };
});

const mockSendLink: SendLink = {
  id: v4(),
  name: 'example-file.txt',
  type: 'file',
  size: 1024,
  networkId: 'network-id-67890',
  encryptionKey: 'encryption-key-abcdef',
  parent_folder: null,
};

const mockSendLinkFolder: SendLink = {
  id: v4(),
  name: 'example-folder',
  type: 'folder',
  size: 0,
  networkId: 'network-id-09876',
  encryptionKey: 'encryption-key-zyxwvu',
  parent_folder: 'parent-folder-id',
};

const mockCreateSendLinksResponse: CreateSendLinksResponse = {
  id: v4(),
  title: 'Example Send Link',
  subject: 'Example Subject',
  code: 'mock-code-abcdef',
  sender: 'mock-sender@example.com',
  receivers: ['receiver1@example.com', 'receiver2@example.com'],
  views: 5,
  userId: 42,
  items: [
    {
      id: v4(),
      name: 'example-file.txt',
      type: 'file',
      size: 1024, // 1 KB
      networkId: 'network-id-67890',
      encryptionKey: 'encryption-key-abcdef',
      parent_folder: null,
    },
    {
      id: v4(),
      name: 'example-folder',
      type: 'folder',
      size: 0,
      networkId: 'network-id-09876',
      encryptionKey: 'encryption-key-zyxwvu',
      parent_folder: 'parent-folder-id',
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  expirationAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
};

describe('upload.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('When the uploadFiles() is done, then should call storeSendLinks() and getCaptchaToken()', async () => {
    const uploadFilesSpy = vi.spyOn(UploadService, 'uploadFiles');
    const storeSendLinksSpy = vi.spyOn(UploadService, 'storeSendLinks');
    (getCaptchaToken as Mock).mockResolvedValue('mock-token');

    // @ts-expect-error - We only mock the properties we need
    const sendSpy = vi.spyOn(SdkManager.instance, 'getSend').mockImplementation(() => {
      return {
        createSendLink: vi.fn().mockResolvedValue(mockCreateSendLinksResponse),
      };
    });

    uploadFilesSpy.mockResolvedValue([mockSendLink, mockSendLinkFolder]);

    const result = await UploadService.uploadFilesAndGetLink([
      {
        id: '1',
        name: 'file1.txt',
        type: 'file',
        size: 100,
        file: {} as unknown as FileWithPath,
      } as unknown as SendItemData,
      {
        id: '2',
        name: 'file2.txt',
        type: 'file',
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
      }),
    );
    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(uploadFilesSpy.mock.invocationCallOrder[0]).toBeLessThan(
      (getCaptchaToken as Mock).mock.invocationCallOrder[0],
    );
    expect((getCaptchaToken as Mock).mock.invocationCallOrder[0]).toBeLessThan(sendSpy.mock.invocationCallOrder[0]);
    expect(result).toContain('/d/');
  });

  test('When links are sent to be created, the captcha is generated before that', async () => {
    const storeSendLinksSpy = vi.spyOn(UploadService, 'storeSendLinks');
    // @ts-expect-error - We only mock the properties we need
    const sendSpy = vi.spyOn(SdkManager.instance, 'getSend').mockImplementation(() => {
      return {
        createSendLink: vi.fn().mockResolvedValue(mockCreateSendLinksResponse),
      };
    });
    (getCaptchaToken as Mock).mockResolvedValue('mock-token');
    vi.spyOn(UploadService, 'uploadFiles').mockResolvedValue([mockSendLink]);

    await UploadService.uploadFilesAndGetLink([
      {
        id: '1',
        name: 'file1.txt',
        type: 'file',
        size: 100,
        file: {} as unknown as FileWithPath,
      } as unknown as SendItemData,
    ]);

    expect(getCaptchaToken).toHaveBeenCalled();
    expect(storeSendLinksSpy).toHaveBeenCalled();
    expect(storeSendLinksSpy.mock.invocationCallOrder[0]).toBeLessThan(
      (getCaptchaToken as Mock).mock.invocationCallOrder[0],
    );
    expect((getCaptchaToken as Mock).mock.invocationCallOrder[0]).toBeLessThan(sendSpy.mock.invocationCallOrder[0]);
  });

  test('When an error is thrown before getCaptchaToken, then getCaptchaToken is not called', async () => {
    const uploadFilesSpy = vi.spyOn(UploadService, 'uploadFiles').mockImplementation(() => {
      throw new Error('Error before captcha');
    });

    await expect(
      UploadService.uploadFilesAndGetLink([
        {
          id: '1',
          name: 'file1.txt',
          type: 'file',
          size: 100,
          file: {} as unknown as FileWithPath,
        } as unknown as SendItemData,
      ]),
    ).rejects.toThrow('Error before captcha');

    expect(uploadFilesSpy).toHaveBeenCalled();
    expect(UploadService.storeSendLinks).not.toHaveBeenCalled();
    expect(getCaptchaToken).not.toHaveBeenCalled();
  });

  test('When an error is thrown in getCaptchaToken, then storeSendLinks is not called', async () => {
    vi.spyOn(UploadService, 'uploadFiles').mockResolvedValue([mockSendLink]);
    (getCaptchaToken as Mock).mockRejectedValue(new Error('Captcha error'));
    // @ts-expect-error - We only mock the properties we need
    const sendSpy = vi.spyOn(SdkManager.instance, 'getSend').mockImplementation(() => {
      return {
        createSendLink: vi.fn().mockResolvedValue(mockCreateSendLinksResponse),
      };
    });

    await expect(UploadService.storeSendLinks).rejects.toThrow('Captcha error');

    expect(getCaptchaToken).toHaveBeenCalled();
    expect(sendSpy).not.toHaveBeenCalled();
  });
});

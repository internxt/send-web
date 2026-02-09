import { beforeEach, describe, expect, test, vi } from 'vitest';
import { randomBytes } from 'node:crypto';
import { Network } from '@internxt/sdk/dist/network';
import { SdkManager } from '../../src/services/sdk-manager.service';
import { AppDetails } from '@internxt/sdk/dist/shared';
import packageJson from '../../package.json';
import envService from './env.service';

describe('SDKManager service', () => {
  const appDetails: AppDetails = {
    clientName: randomBytes(16).toString('hex'),
    clientVersion: randomBytes(16).toString('hex'),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('When getAppDetails is requested, then it is generated using packageJson values', () => {
    const expectedAppdetails = {
      clientName: packageJson.name,
      clientVersion: packageJson.version,
    };

    const appDetailsResponse = SdkManager.getAppDetails();
    expect(expectedAppdetails).to.be.deep.equal(appDetailsResponse);
  });

  test('When Network client is requested, then it is generated using internxt sdk', () => {
    const envEndpoint: { key: string; value: string } = {
      key: 'networkUrl',
      value: 'test/network',
    };

    const client = Network.client(envEndpoint.value, appDetails, {
      bridgeUser: 'bridgeUser',
      userId: 'userId',
    });

    const spyConfigService = vi.spyOn(envService, 'getVariable').mockReturnValue(envEndpoint.value);
    vi.spyOn(SdkManager, 'getAppDetails').mockReturnValue(appDetails);
    vi.spyOn(Network, 'client').mockReturnValue(client);

    const newClient = SdkManager.instance.getNetwork({
      user: 'bridgeUser',
      pass: '123',
    });

    expect(spyConfigService).toHaveBeenCalledWith(envEndpoint.key);
    expect(newClient).to.be.deep.equal(client);
  });
});

import packageJson from '../../package.json';
import envService from './env.service';
import { AppDetails } from '@internxt/sdk/dist/shared';
import { Network } from '@internxt/sdk/dist/network';
import { Send } from '@internxt/sdk/dist/send';

/**
 * Manages all the sdk submodules initialization
 * based on the current apiSecurity details
 */
export class SdkManager {
  public static readonly instance: SdkManager = new SdkManager();

  /**
   * Returns the application details from package.json
   * @returns The name and the version of the app from package.json
   **/
  public static readonly getAppDetails = (): AppDetails => {
    return {
      clientName: packageJson.name,
      clientVersion: packageJson.version,
    };
  };

  /** Network SDK */
  public getNetwork = (credentials: { user: string; pass: string }) => {
    const appDetails = SdkManager.getAppDetails();

    return Network.client(envService.getVariable('networkUrl'), appDetails, {
      bridgeUser: credentials.user,
      userId: credentials.pass,
    });
  };

  /** Send SDK */
  public getSend = (customHeaders?: Record<string, string>) => {
    const appDetails = SdkManager.getAppDetails();

    return Send.client(envService.getVariable('sendApiUrl'), {
      ...appDetails,
      ...(customHeaders ? { customHeaders } : {}),
    });
  };
}

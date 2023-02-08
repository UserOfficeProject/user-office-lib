import { BaseClient, Issuer, TokenSet, UserinfoResponse } from 'openid-client';

import { ValidTokenSet } from './model/ValidTokenSet';
import { ValidUserInfo } from './model/ValidUserInfo';

export class OpenIdClient {
  private static instance: BaseClient | null = null;

  /**
   * This function is used to get the user profile from the authorization code
   * @param code authorization code
   * @param redirectUri redirect uri, this must match to what is specified in authorization server
   * @returns
   */
  public static async login(code: string, redirectUri: string) {
    try {
      /**
       * Requesting Authorization server to exchange the code for a tokenset,
       ** and validating the return value that it has both - access_token and id_token
       */
      const callbackParams = new URLSearchParams();
      callbackParams.append('code', code);

      const instance = await this.getInstance();

      const params = instance.callbackParams(`?${callbackParams.toString()}`);

      const tokenSet = OpenIdClient.validateTokenSet(
        await instance.callback(redirectUri, params)
      );

      /**
       * Getting and validating the userProfile from the previously obtained tokenset
       */
      const userProfile = this.validateUserProfile(
        await instance.userinfo<UserinfoResponse>(tokenSet)
      );

      /**
       * If the user profile is valid, then we upsert the user and return it
       */

      return { tokenSet, userProfile };
    } catch (error) {
      throw new Error(
        'Error ocurred while logging in with external token. OpenIdclient error:"' +
          (error as Error)?.message +
          '"'
      );
    }
  }

  /**
   * Invalidate the accessToken
   * @param accessToken accesstoken received from the the login method
   */
  public static async logout(accessToken: string) {
    const instance = await this.getInstance();
    await instance.revoke(accessToken);
  }

  /**
   * Url to redirect the user to in order to login
   * @returns the string with the url
   */
  public static async loginUrl() {
    const instance = await this.getInstance();

    return instance.authorizationUrl({
      scope: this.getScopes().join(' '),
    });
  }

  /**
   * This function is used to get the instance of the openid client
   * @returns return string with the url
   * */
  public static async logoutUrl() {
    const instance = await this.getInstance();
    let endSessionUrl: string;
    try {
      endSessionUrl = instance.endSessionUrl(); // try obtaining the end session url the standard way
    } catch (e) {
      endSessionUrl =
        (instance.issuer.ping_end_session_endpoint as string) ?? '/'; // try using PING ping_end_session_endpoint
    }

    return endSessionUrl;
  }

  /**
   * This function is used to get the instance of the openid client
   * @returns return config object
   * */
  public static getConfig() {
    const discoveryUrl = process.env.AUTH_DISCOVERY_URL;
    const clientId = process.env.AUTH_CLIENT_ID;
    const clientSecret = process.env.AUTH_CLIENT_SECRET;
    if (!discoveryUrl || !clientId || !clientSecret) {
      throw new Error('One or more ENV variables for OAUTH not defined');
    }

    return {
      discoveryUrl,
      clientId,
      clientSecret,
    };
  }

  /**
   * Returns true if config is set in the environment variables
   * */
  public static hasConfig() {
    try {
      const { discoveryUrl, clientId, clientSecret } = this.getConfig();

      return !!discoveryUrl && !!clientId && !!clientSecret;
    } catch (error) {
      return false;
    }
  }

  static async getInstance() {
    if (!this.instance) {
      this.instance = await this.createClient();
    }

    return this.instance;
  }

  private static getScopes() {
    return ['openid', 'profile', 'email'];
  }

  private static async createClient() {
    const { clientId, clientSecret } = this.getConfig();

    const OpenIDIssuer = await this.getIssuer();

    return new OpenIDIssuer.Client({
      client_id: clientId,
      client_secret: clientSecret,
      response_types: ['code'],
    });
  }

  private static failCounter = 0;
  /**
   * Get the issuer from the discovery url
   * if it fails to get the issuer, then it will try to get the issuer again
   * after 2^n seconds, where n is the number of fails occurred so far
   * @returns {Promise<Issuer>}
   */
  private static async getIssuer(): Promise<Issuer<BaseClient>> {
    const { discoveryUrl } = this.getConfig();

    try {
      const issuer = await Issuer.discover(discoveryUrl);
      if (issuer) {
        this.failCounter = 0;
        console.info('OAuthIssuer discovery successful', {
          discoveryUrl,
        });

        return issuer;
      } else {
        console.error(
          'Unexpected behavior of Issuer. The returned client is null',
          {
            discoveryUrl,
          }
        );

        throw new Error('OAuthIssuer discovery failed');
      }
    } catch (error) {
      console.error('Error ocurred while obtaining OAuthIssuer', {
        error: (error as Error)?.message,
        numberOfFails: this.failCounter,
      });

      return new Promise((resolve) => {
        this.failCounter++;
        setTimeout(() => {
          resolve(this.getIssuer());
        }, 1000 * Math.pow(2, this.failCounter)); // repeat the request after 2^n seconds
      });
    }
  }

  private static validateUserProfile(
    userProfile: UserinfoResponse
  ): ValidUserInfo {
    return {
      ...userProfile,
      email: userProfile.email ?? '',
      family_name: userProfile.family_name ?? '',
      given_name: userProfile.given_name ?? '',
    } as ValidUserInfo;
  }

  private static validateTokenSet(tokenSet: TokenSet): ValidTokenSet {
    if (!tokenSet.access_token) {
      console.error('Invalid tokenSet', {
        authorizer: this.constructor.name,
        tokenSet,
      });
      throw new Error('Invalid tokenSet');
    }

    return tokenSet as ValidTokenSet;
  }
}

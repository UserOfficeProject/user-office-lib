import { logger } from '@user-office-software/duo-logger';
import {
  BaseClient,
  Issuer,
  RevokeExtras,
  TokenSet,
  TokenTypeHint,
  UserinfoResponse,
} from 'openid-client';

import { ValidTokenSet } from './ValidTokenSet';
import { ValidUserInfo } from './ValidUserInfo';

/**
 * OpenIdClient is a wrapper around the openid-client library
 * It provides simple to use interace using facade accessible by singleton
 * Library contains auth logic that is shared for all Single Sign On projects
 */
export class OpenIdClient {
  private static instance: OpenIdClient;

  private constructor(public client: BaseClient) {}

  static async getInstance() {
    if (!this.instance) {
      const client = await this.createClient();
      this.instance = new OpenIdClient(client);
    }

    return this.instance;
  }

  /**
   * Requesting Authorization server to exchange the code for a tokenset
   * @param code The code obtained from the authorization code flow
   * @returns {Promise<ValidTokenSet>}
   * @throws {Error} If the tokenset is invalid
   * @throws {Error} If if the environment variables are not set
   * @throws {Error} If discovery service fails to get the issuer
   */
  public async authorize(code: string, redirectUrl: string) {
    /**
     * @description Requesting Authorization server to exchange the code for a tokenset
     * and validating the return value that it has both - access_token and id_token
     */
    const params = this.client.callbackParams('?code=' + code);
    const tokenSet = this.validateTokenSet(
      await this.client.callback(redirectUrl, params)
    );

    /**
     * Getting and validating the userProfile from the previously obtained tokenset
     */
    const userProfile = this.validateUserProfile(
      await this.client.userinfo<UserinfoResponse>(tokenSet)
    );

    return {
      idToken: userProfile,
      accessToken: tokenSet.access_token,
      refreshToken: tokenSet.refresh_token,
    };
  }

  public async revoke(
    token: string,
    tokenTypeHint?: TokenTypeHint,
    extras?: RevokeExtras
  ) {
    return this.client.revoke(token, tokenTypeHint, extras);
  }

  public getAuthorizationUrl() {
    const scopes = OpenIdClient.getScopes().join(' ');

    return this.client.authorizationUrl({ scope: scopes });
  }

  public getEndSessionUrl() {
    let endSessionUrl;
    try {
      endSessionUrl = this.client.endSessionUrl(); // try obtaining the end session url the standard way
    } catch (e) {
      endSessionUrl =
        (this.client.issuer.ping_end_session_endpoint as string) ?? '/'; // try using PING ping_end_session_endpoint
    }

    return endSessionUrl;
  }

  /**
   * Get the configuration from the environment variables
   * @returns {Promise<{discoveryUrl: string, clientId: string, clientSecret: string, redirectUrl: string}>}
   */
  public static getConfig() {
    const discoveryUrl = process.env.AUTH_DISCOVERY_URL;
    const clientId = process.env.AUTH_CLIENT_ID;
    const clientSecret = process.env.AUTH_CLIENT_SECRET;
    const redirectUrl = process.env.AUTH_REDIRECT_URL;

    if (!discoveryUrl || !clientId || !clientSecret || !redirectUrl) {
      logger.logError('One or more ENV variables not defined', {
        discoveryUrl,
        clientId,
        clientSecret: clientSecret ? '******' : undefined,
        redirectUrl,
      });
      throw new Error('One or more ENV variables not defined');
    }

    return {
      discoveryUrl,
      clientId,
      clientSecret,
      redirectUrl,
    };
  }

  /**
   * Checks if the environmental variables are set
   * @returns {boolean}
   */
  public static hasConfiguration() {
    const { discoveryUrl, clientId, clientSecret, redirectUrl } =
      this.getConfig();

    return !!discoveryUrl && !!clientId && !!clientSecret && !!redirectUrl;
  }

  /**
   * Gets scopes
   * @returns
   */
  public static getScopes() {
    return ['openid', 'profile', 'email'];
  }

  private static async createClient() {
    const { clientId, clientSecret, redirectUrl } = this.getConfig();

    const OpenIDIssuer = await this.getIssuer();

    return new OpenIDIssuer.Client({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: [redirectUrl],
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
        logger.logInfo('OAuthIssuer discovery successful', {
          discoveryUrl,
        });

        return issuer;
      } else {
        logger.logError(
          'Unexpected behavior of Issuer. The returned client is null',
          {
            discoveryUrl,
          }
        );

        throw new Error('OAuthIssuer discovery failed');
      }
    } catch (error) {
      logger.logError('Error ocurred while obtaining OAuthIssuer', {
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

  private validateUserProfile(userProfile: UserinfoResponse): ValidUserInfo {
    if (
      !userProfile.email ||
      !userProfile.family_name ||
      !userProfile.given_name ||
      !userProfile.sub
    ) {
      logger.logError('Invalid user profile', {
        authorizer: this.constructor.name,
        userProfile,
      });
      throw new Error('Invalid user profile');
    }

    return userProfile as ValidUserInfo;
  }

  private validateTokenSet(tokenSet: TokenSet): ValidTokenSet {
    if (!tokenSet.access_token) {
      logger.logError('Invalid tokenSet', {
        authorizer: this.constructor.name,
        tokenSet,
      });
      throw new Error('Invalid tokenSet');
    }

    return tokenSet as ValidTokenSet;
  }
}

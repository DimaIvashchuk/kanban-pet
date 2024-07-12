import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

const SERVER_SHORT_MEMORY_FOR_OAUTH = {};

@Injectable()
export class AuthService {
  private readonly loggerService = new Logger(AuthService.name);
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async outhRequestUri(referer: string) {
    try {
      const codeVerifier = crypto.pseudoRandomBytes(43).toString('base64url');
      const codeChallenge = crypto
        .createHash('sha256')
        .update(codeVerifier)
        .digest()
        .toString('base64url');
      const state = crypto.pseudoRandomBytes(32).toString('base64url');

      SERVER_SHORT_MEMORY_FOR_OAUTH[state] = codeVerifier;

      const clientRedirectUrl = `${referer}sso/google/callback`;

      const googleConfig = this.configService.getOrThrow('google');

      const authUri =
        googleConfig.host +
        '/o/oauth2/v2/auth' +
        '?client_id=' +
        googleConfig.clientId +
        '&response_type=code&redirect_uri=' +
        clientRedirectUrl +
        '&scope=' +
        googleConfig.scopes +
        '&code_challenge=' +
        codeChallenge +
        '&code_challenge_method=S256' +
        '&state=' +
        state;
      return authUri;
    } catch (ex) {
      this.loggerService.error(ex);
      throw ex;
    }
  }

  async exchangeCodeForToken(code: string, state: string, referer: string) {
    try {
      const googleConfig = this.configService.getOrThrow('google');
      const clientRedirectUrl = `${referer}sso/google/callback`;

      const response = await axios.post(
        `https://oauth2.googleapis.com/token`,
        null,
        {
          params: {
            code,
            client_id: googleConfig.clientId,
            client_secret: googleConfig.clientSecret,
            redirect_uri: clientRedirectUrl,
            grant_type: 'authorization_code',
            code_verifier: SERVER_SHORT_MEMORY_FOR_OAUTH[state],
          },
        },
      );

      const { access_token } = response.data;

      const userInfoResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        },
      );

      // email, given_name, family_name, picture
      const userInfo = userInfoResponse.data;

      const user = await this.completeOauthLogin({
        email: userInfo.email,
        givenName: userInfo.given_name,
        familyName: userInfo.family_name,
        picture: userInfo.picture,
      });

      return {
        accessToken: await this.issueJWTAccessToken(user),
        refreshToken: await this.issueJWTRefreshToken(user),
      };
    } catch (ex) {
      this.loggerService.error(ex);
      throw ex;
    }
  }

  private async issueJWTAccessToken(user: User): Promise<{
    token: string;
    token_type: string;
  }> {
    const jwtConfig = this.configService.getOrThrow('auth.jwt');

    const accessToken = jwt.sign(
      {
        id: user.id,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
      },
      jwtConfig.accessSecret,
      {
        expiresIn: jwtConfig.accessExpiresIn,
      },
    );

    return {
      token_type: 'Bearer',
      token: accessToken,
    };
  }

  private async issueJWTRefreshToken(user: User): Promise<{
    token: string;
    token_type: string;
  }> {
    const jwtConfig = this.configService.getOrThrow('auth.jwt');

    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      jwtConfig.refreshSecret,
      {
        expiresIn: jwtConfig.refreshExpiresIn,
      },
    );

    return {
      token_type: 'Bearer',
      token: refreshToken,
    };
  }

  private async completeOauthLogin({
    email,
    givenName,
    familyName,
    picture,
  }: {
    email: string;
    givenName: string;
    familyName: string;
    picture: string;
  }) {
    try {
      const existedUser = await this.userService.findUserByEmail(email);

      if (existedUser) {
        return existedUser;
      }

      const user = await this.userService.create({
        email,
        firstName: givenName,
        lastName: familyName,
        picture,
      });

      return user;
    } catch (ex) {
      this.loggerService.error(ex);
      throw ex;
    }
  }
}

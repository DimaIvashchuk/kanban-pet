import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { TAuth, TGoogleOAuth } from 'src/base/configuration';
import { UserService } from 'src/modules/user/user.service';

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

  async exchangeCodeForToken(
    code: string,
    state: string,
    referer: string,
    response: Response,
  ) {
    try {
      const googleConfig =
        this.configService.getOrThrow<TGoogleOAuth>('google');
      const clientRedirectUrl = `${referer}sso/google/callback`;

      const tokenResponse = await axios.post(
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

      const { access_token } = tokenResponse.data;

      const userInfoResponse = await axios.get(googleConfig.userInfoUri, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      // email, given_name, family_name, picture
      const userInfo = userInfoResponse.data;

      const user = await this.completeOauthLogin({
        email: userInfo.email,
        givenName: userInfo.given_name,
        familyName: userInfo.family_name,
        picture: userInfo.picture,
      });

      const jwtConfig = this.configService.getOrThrow<TAuth>('auth');

      const accessToken = user.issueJWTAccessToken(jwtConfig);
      const refreshToken = user.issueJWTRefreshToken(jwtConfig);

      await this.userService.update(user.id, user);

      response.cookie(jwtConfig.jwt.access.cookie, accessToken);
      response.cookie(jwtConfig.jwt.refresh.cookie, refreshToken);

      return {
        message: 'ok',
      };
    } catch (ex) {
      this.loggerService.error(ex);
      throw ex;
    }
  }

  async refreshToken(
    rToken: string,
    request: Request | null,
    response: Response,
  ) {
    try {
      const jwtConfig = this.configService.getOrThrow<TAuth>('auth');

      const refreshToken =
        rToken || request.cookies[jwtConfig.jwt.refresh.cookie];

      if (!refreshToken) {
        throw new ForbiddenException('Missing refresh token');
      }

      const { sub } = jwt.verify(refreshToken, jwtConfig.jwt.refresh.secret);

      const rTknHash = crypto
        .createHmac('sha256', jwtConfig.jwt.refresh.secret)
        .update(refreshToken)
        .digest('hex');

      const user = await this.userService.findOneByRefreshTokenAndId(
        sub as string,
        rTknHash,
      );

      if (!user) {
        throw new UnauthorizedException();
      }

      const newAccessToken = user.issueJWTAccessToken(jwtConfig);

      response.cookie(jwtConfig.jwt.access.cookie, newAccessToken);

      await this.userService.update(user.id, user);

      return {
        message: 'ok',
      };
    } catch (ex) {
      this.loggerService.error(ex);
      throw ex;
    }
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

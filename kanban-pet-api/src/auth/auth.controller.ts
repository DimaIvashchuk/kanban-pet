import { Body, Controller, Get, Headers, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import throwException from 'src/base/throwException';
import { Request, Response } from 'express';

@Controller({
  version: '1',
  path: 'auth',
})
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/oauth/request-uri')
  async requestOauthUri(@Headers('referer') referer: string) {
    try {
      const redirectUri = await this.authService.outhRequestUri(referer);

      return {
        redirectUri,
      };
    } catch (ex) {
      throwException(ex);
    }
  }

  @Post('/oauth/exchange')
  async exchangeCodeForToken(
    @Body('code') code: string,
    @Body('state') state: string,
    @Headers('referer') referer: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const data = await this.authService.exchangeCodeForToken(
        code,
        state,
        referer,
        response,
      );

      return {
        data,
      };
    } catch (ex) {
      throwException(ex);
    }
  }

  @Post('/refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const data = await this.authService.refreshToken(request, response);

      return {
        data,
      };
    } catch (ex) {
      throwException(ex);
    }
  }
}

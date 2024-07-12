import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import throwException from 'src/base/throwException';

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
  ) {
    try {
      const data = await this.authService.exchangeCodeForToken(
        code,
        state,
        referer,
      );

      return {
        data,
      };
    } catch (ex) {
      throwException(ex);
    }
  }
}

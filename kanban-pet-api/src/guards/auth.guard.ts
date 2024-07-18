import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { TAuth } from 'src/base/configuration';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();
    const token = this.extractTokenFromCookie(request);
    const authKey = this.extractAuthKeyFromHeader(request);

    // for testing purposes
    if (authKey) {
      if (authKey === this.configService.getOrThrow('auth.key')) {
        throw new UnauthorizedException('Invalid auth key');
      }

      return true;
    }

    if (!token) {
      throw new UnauthorizedException();
    }

    const jwtConfig = this.configService.getOrThrow<TAuth>('auth');

    try {
      const payload = jwt.verify(token, jwtConfig.jwt.access.secret);

      request['user'] = payload;
      request['userId'] = payload.sub;
    } catch (ex) {
      const rToken = this.extractRefreshTokenFromCookie(request);

      if (!rToken) {
        throw new ForbiddenException(ex);
      }

      try {
        await this.authService.refreshToken(rToken, null, response);
      } catch (refreshError) {
        throw new ForbiddenException(ex);
      }
    }
    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    const jwtConfig = this.configService.getOrThrow<TAuth>('auth');
    const [type, token] =
      request.cookies[jwtConfig.jwt.access.cookie]?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractRefreshTokenFromCookie(request: Request): string | undefined {
    const jwtConfig = this.configService.getOrThrow<TAuth>('auth');
    const token = request.cookies[jwtConfig.jwt.refresh.cookie];
    return token;
  }

  private extractAuthKeyFromHeader(request: Request): string | null {
    const token = request.headers['x-auth-key']?.toString() || null;

    return token;
  }
}

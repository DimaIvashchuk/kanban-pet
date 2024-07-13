import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { TAuth } from 'src/base/configuration';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);
    const authKey = this.extractAuthKeyFromHeader(request);

    console.log(token);

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

    const jwtConfig = this.configService.getOrThrow('auth.jwt');

    try {
      const payload = jwt.verify(token, jwtConfig.accessSecret);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch (ex) {
      if (ex.name === 'TokenExpiredError') throw new ForbiddenException(ex);
    }
    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    const jwtConfig = this.configService.getOrThrow<TAuth>('auth');
    const [type, token] =
      request.cookies[jwtConfig.jwt.access.cookie]?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractAuthKeyFromHeader(request: Request): string | null {
    const token = request.headers['x-auth-key']?.toString() || null;

    return token;
  }
}

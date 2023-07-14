import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Request as NestRequest,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export type AuthenticatedRequest = typeof NestRequest & {
  user: {
    sub: string;
    username: string;
    iat: number;
    exp: number;
  };
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const [scheme, token] = request.headers.authorization?.split(' ') ?? [];
    if (/Bearer/i.test(scheme) == false) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_TOKEN'),
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}

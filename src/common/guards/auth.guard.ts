import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwtDecode from 'jwt-decode';
import { AuthService } from 'src/modules/auth/auth.service';
import * as jsonwebtoken from 'jsonwebtoken';
import * as jwkToPem from 'jwk-to-pem';
import * as jwkJson from '../../../jwk.json'

export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    @Inject('AuthService') private readonly authService: AuthService,
    @Inject('ConfigService') private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { query, route } = request;

    let authorization = request.headers?.authorization;

    if (query && query.download
        && route.path.indexOf('download-attachments') > -1) {
      authorization = `Bearer ${query.download}`;
    }

    if (!authorization) {
      throw new UnauthorizedException('authorization is not specified');
    }

    const [type, token] = authorization.split(' ');

    if ((type || '').trim() !== 'Bearer' || !token) {
      throw new BadRequestException('token is invalid');
    }
    let jwk;

    switch (this.configService.get('ENVIRONMENT')) {
      case 'PRODUCTION':
        jwk = jwkJson.prod;
        break;

      case 'STAGING':
        jwk = jwkJson.staging;
        break;

      default:
        jwk = jwkJson.dev;
        break;
    }

    const pem = jwkToPem(jwk.keys[0]);

    try {
      jsonwebtoken.verify(token, pem, {
        algorithms: ['RS256'],
      });

      const identity: {
        email?
      } = jwtDecode(token);

      await this.authService.setAuthUser(identity?.email);

      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}

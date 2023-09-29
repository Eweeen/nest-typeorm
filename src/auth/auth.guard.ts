import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { readFileSync } from 'fs';
import { JwtService } from '@nestjs/jwt';
import { extractTokenFromHeader } from '../common/functions';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly publicKey: string;

  public constructor(private readonly jwtService: JwtService) {
    this.publicKey = readFileSync('./jwt/id_rsa.pub', 'utf8');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token: string = extractTokenFromHeader(request);

    if (!token) return false;

    try {
      await this.jwtService.verifyAsync(token, {
        algorithms: ['RS256'],
        secret: this.publicKey,
      });
    } catch (error) {
      const message: string = 'Token Error: ' + (error.message || error.name);
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }

    return true;
  }
}

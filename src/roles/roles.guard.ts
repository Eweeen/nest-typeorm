import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { extractTokenFromHeader } from '../common/functions';
import { JwtService } from '@nestjs/jwt';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Réception des rôles autorisés pour la route
    const arrayRoles: string[] = this.reflector.get<string[]>(
      'restrictedRolesForAuth',
      context.getHandler(),
    ) || ['user', 'admin'];

    try {
      // Réception du token
      const request: any = context.switchToHttp().getRequest();
      const token: string = extractTokenFromHeader(request);

      // Le rôle du token est-il autorisé pour la route ?
      const role: Role = this.jwtService.decode(token)['role'];
      const includes: boolean = arrayRoles.includes(role.label);

      if (!includes) throw new Error();

      return includes;
    } catch (_) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}

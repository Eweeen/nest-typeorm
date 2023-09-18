import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import jwt from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Réception des rôles autorisés pour la route
    const arrayRoles: string[] = this.reflector.get<string[]>(
      'restrictedRolesForAuth',
      context.getHandler(),
    ) || ['user', 'admin'];

    try {
      // Réception du token
      const request: any = context.switchToHttp().getRequest();
      const auth = request.headers.authorization;

      // Le token est valide ?
      if (!auth || !auth.startsWith('Bearer ')) return false;

      // Extrait le token
      const token: string = auth.split(' ')[1];

      // Le rôle du token est-il autorisé pour la route ?
      const role = jwt.decode(token)['role'];
      return arrayRoles.includes(role);
    } catch (_) {
      return false;
    }
  }
}

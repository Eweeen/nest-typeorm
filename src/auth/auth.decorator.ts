import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from '../roles/roles.guard';

export function Auth(...roles: ('user' | 'admin')[]) {
  return applyDecorators(
    SetMetadata('restrictedRolesForAuth', roles),
    UseGuards(AuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

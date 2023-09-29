import { Request } from 'express';

export function extractTokenFromHeader(request: Request): string | undefined {
  const auth = request.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return undefined;
  return auth.split(' ')[1];
}

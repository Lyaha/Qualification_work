import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { User, UserRole } from '../entity/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User;

    // Если нет пользователя — не пускаем
    if (!user) return false;

    // Блокируем только если роль CLIENT
    if (user.role === UserRole.CLIENT || user.role === UserRole.WORKER) {
      throw new ForbiddenException('Access denied for clients');
    }

    return true;
  }
}

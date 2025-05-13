import { UserRole } from '../bd.models/entity/user.entity';

export const RolePermissions: Record<UserRole, UserRole[]> = {
  [UserRole.CLIENT]: [],
  [UserRole.WORKER]: [],
  [UserRole.MANAGER]: [UserRole.WORKER],
  [UserRole.ADMIN]: [
    UserRole.CLIENT,
    UserRole.WORKER,
    UserRole.MANAGER,
    UserRole.ADMIN,
    UserRole.DIRECTOR,
  ],
  [UserRole.DIRECTOR]: [
    UserRole.CLIENT,
    UserRole.WORKER,
    UserRole.MANAGER,
    UserRole.ADMIN,
    UserRole.DIRECTOR,
  ],
};

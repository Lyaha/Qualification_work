import { Injectable } from '@nestjs/common';
import { User, UserRole } from '../entity/user.entity';
import { MenuItem, menuConfig } from '../../config/menu.config';

@Injectable()
export class MenuService {
  getMenuForUser(user: User): MenuItem[] {
    return this.filterMenuItems(menuConfig, user.role);
  }

  private filterMenuItems(items: MenuItem[], userRole: UserRole): MenuItem[] {
    return items
      .filter((item) => item.allowedRoles.includes(userRole))
      .map((item) => ({
        ...item,
        children: item.children ? this.filterMenuItems(item.children, userRole) : undefined,
      }))
      .filter((item) => !item.children || item.children.length > 0);
  }
}

import { Injectable } from '@nestjs/common';
import { User, UserRole } from '../bd.models/entity/user.entity';
import { MenuItem, menuConfig } from '../config/menu.config';

@Injectable()
export class MenuService {
  getMenuForUser(user: User): MenuItem[] {
    return this.filterMenuItems(menuConfig, user.role);
  }

  checkAccess(user: User, path: string): boolean {
    const allowedPaths = this.getAllowedPaths(menuConfig, user.role);
    return allowedPaths.includes(path);
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

  private getAllowedPaths(items: MenuItem[], userRole: UserRole): string[] {
    const paths: string[] = [];

    items.forEach((item) => {
      if (item.allowedRoles.includes(userRole)) {
        paths.push(item.path);

        if (item.children) {
          paths.push(...this.getAllowedPaths(item.children, userRole));
        }
      }
    });

    return paths;
  }
}

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
    const cleanPath = path.split('?')[0];
    //console.log('=== Access Check ===');
    //console.log('User role:', user.role);
    //console.log('Requested path:', cleanPath);
    //console.log('Allowed paths:', allowedPaths);
    const result = allowedPaths.some((allowedPath) => {
      const regexPattern = allowedPath.replace(/\/:\w+/g, '\/[a-fA-F0-9-]+').replace(/\//g, '\\/');

      const regex = new RegExp(`^${regexPattern}$`);
      const testResult = regex.test(cleanPath);

      //console.log(`Testing "${allowedPath}" -> ${regex}: ${testResult}`);
      return testResult;
    });

    //console.log('Final result:', result);
    //console.log('====================');
    return result;
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

    const traverse = (items: MenuItem[]) => {
      items.forEach((item) => {
        if (item.allowedRoles.includes(userRole)) {
          paths.push(item.path);
          if (item.children) {
            traverse(item.children);
          }
        }
      });
    };

    traverse(items);
    return paths;
  }
}

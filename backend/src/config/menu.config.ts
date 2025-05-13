import { UserRole } from '../bd.models/entity/user.entity';

export interface MenuItem {
  id: string;
  translations: {
    uk: string;
    en: string;
  };
  path: string;
  icon?: string;
  allowedRoles: UserRole[];
  children?: MenuItem[];
}

export const menuConfig: MenuItem[] = [
  {
    id: 'dashboard',
    translations: {
      uk: 'Головна',
      en: 'Dashboard',
    },
    path: '/start',
    icon: 'home',
    allowedRoles: [UserRole.WORKER, UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
  },
  {
    id: 'tasks',
    translations: {
      uk: 'Завдання',
      en: 'Tasks',
    },
    path: '/tasks',
    icon: 'tasks',
    allowedRoles: [UserRole.WORKER, UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
  },
  {
    id: 'warehouse',
    translations: {
      uk: 'Склад',
      en: 'Warehouse',
    },
    path: '/warehouse',
    icon: 'warehouse',
    allowedRoles: [UserRole.WORKER, UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
    children: [
      {
        id: 'inventory',
        translations: {
          uk: 'Інвентар',
          en: 'Inventory',
        },
        path: '/warehouse/inventory',
        allowedRoles: [UserRole.WORKER, UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
      },
      {
        id: 'zones',
        translations: {
          uk: 'Зони зберігання',
          en: 'Storage Zones',
        },
        path: '/warehouse/zones',
        allowedRoles: [UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
      },
    ],
  },
  {
    id: 'orders',
    translations: {
      uk: 'Замовлення',
      en: 'Orders',
    },
    path: '/orders',
    icon: 'shopping-cart',
    allowedRoles: [UserRole.WORKER, UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
  },
  {
    id: 'supplies',
    translations: {
      uk: 'Поставки',
      en: 'Supplies',
    },
    path: '/supplies',
    icon: 'truck',
    allowedRoles: [UserRole.WORKER, UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
  },
  {
    id: 'reports',
    translations: {
      uk: 'Звіти',
      en: 'Reports',
    },
    path: '/reports',
    icon: 'chart-bar',
    allowedRoles: [UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
  },
  {
    id: 'settings',
    translations: {
      uk: 'Налаштування',
      en: 'Settings',
    },
    path: '/settings',
    icon: 'cog',
    allowedRoles: [UserRole.ADMIN, UserRole.DIRECTOR],
    children: [
      {
        id: 'users',
        translations: {
          uk: 'Користувачі',
          en: 'Users',
        },
        path: '/settings/users',
        allowedRoles: [UserRole.ADMIN, UserRole.DIRECTOR],
      },
      {
        id: 'roles',
        translations: {
          uk: 'Ролі та права',
          en: 'Roles & Permissions',
        },
        path: '/settings/roles',
        allowedRoles: [UserRole.DIRECTOR],
      },
    ],
  },
];

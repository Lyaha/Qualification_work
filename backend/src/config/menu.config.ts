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
  hidden?: boolean;
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
    id: 'product',
    translations: {
      uk: 'Товари',
      en: 'Product',
    },
    path: '/products',
    icon: 'cookie-bite',
    allowedRoles: [UserRole.WORKER, UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
    children: [
      {
        id: 'batch',
        translations: {
          uk: 'Партія',
          en: 'Batch',
        },
        path: '/batch',
        allowedRoles: [UserRole.WORKER, UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
      },
      {
        id: 'product-batches',
        translations: {
          uk: 'Партії товару',
          en: 'Product Batches',
        },
        path: '/batches/:productId',
        hidden: true,
        allowedRoles: [UserRole.WORKER, UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
      },
      {
        id: 'batch-location',
        translations: {
          uk: 'Розміщення партій',
          en: 'Batches Location',
        },
        path: '/batch-location',
        allowedRoles: [UserRole.WORKER, UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
      },
      {
        id: 'batch-location-batchId',
        translations: {
          uk: 'Розміщення партії',
          en: 'Batch Location',
        },
        path: '/batch-location/:batchId',
        hidden: true,
        allowedRoles: [UserRole.WORKER, UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
      },
      {
        id: 'category',
        translations: {
          uk: 'Категорії',
          en: 'Categories',
        },
        path: '/category',
        allowedRoles: [UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
      },
      {
        id: 'discount',
        translations: {
          uk: 'Знижки',
          en: 'Discounts',
        },
        path: '/discount',
        allowedRoles: [UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
      },
    ],
  },
  {
    id: 'tasks',
    translations: {
      uk: 'Завдання',
      en: 'Tasks',
    },
    path: '/task',
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
        id: 'storage-zone',
        translations: {
          uk: 'Зони зберігання складу',
          en: 'Storage Zones Warehouse',
        },
        path: '/storage-zone/:warehouse_id',
        allowedRoles: [UserRole.WORKER, UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
        hidden: true,
      },
      {
        id: 'zones',
        translations: {
          uk: 'Зони зберігання',
          en: 'Storage Zones',
        },
        path: '/storage-zone/',
        allowedRoles: [UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
      },
      {
        id: 'invetory-movement',
        translations: {
          uk: 'Рух товарів',
          en: 'Inventory Movement',
        },
        path: '/movements/',
        allowedRoles: [UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
      },
      {
        id: 'box',
        translations: {
          uk: 'Коробки',
          en: 'Boxes',
        },
        path: '/box/',
        allowedRoles: [UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
      },
      {
        id: 'parking',
        translations: {
          uk: 'Парковка',
          en: 'Parking',
        },
        path: '/parking-spot',
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
    children: [
      {
        id: 'order-item',
        translations: {
          uk: 'Елементи замовлень',
          en: 'Order Items',
        },
        path: '/order-item',
        allowedRoles: [UserRole.WORKER, UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
        children: [
          {
            id: 'order-item-details',
            translations: {
              uk: 'Деталі замовлення',
              en: 'Order Details',
            },
            path: '/order-item/:orderId',
            hidden: true,
            allowedRoles: [UserRole.WORKER, UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
          },
        ],
      },
    ],
  },
  {
    id: 'supplies',
    translations: {
      uk: 'Поставки',
      en: 'Supply Orders',
    },
    path: '/supply-order',
    icon: 'truck',
    allowedRoles: [UserRole.WORKER, UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
    children: [
      {
        id: 'suppliers',
        translations: {
          uk: 'Постачальники',
          en: 'Suppliers',
        },
        path: '/supplier',
        allowedRoles: [UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
      },
      {
        id: 'supply-order-items-details',
        translations: {
          uk: 'Елементи поставки',
          en: 'Supply Items',
        },
        path: '/supply-order-item/:supplyOrderId',
        hidden: true,
        allowedRoles: [UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
      },
      {
        id: 'supply-order-items',
        translations: {
          uk: 'Елементи поставки',
          en: 'Supply Items',
        },
        path: '/supply-order-item',
        allowedRoles: [UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
      },
    ],
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
    children: [
      {
        id: 'reviews',
        translations: {
          uk: 'Відгуки',
          en: 'Reviews',
        },
        path: '/review',
        allowedRoles: [UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
      },
    ],
  },
  {
    id: 'settings',
    translations: {
      uk: 'Налаштування',
      en: 'Settings',
    },
    path: '/settings',
    icon: 'cog',
    allowedRoles: [UserRole.WORKER, UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR],
    children: [
      {
        id: 'users',
        translations: {
          uk: 'Користувачі',
          en: 'Users',
        },
        path: '/users',
        allowedRoles: [UserRole.ADMIN, UserRole.DIRECTOR],
      },
      {
        id: 'roles',
        translations: {
          uk: 'Ролі та права',
          en: 'Roles & Permissions',
        },
        path: '/roles',
        allowedRoles: [UserRole.ADMIN, UserRole.DIRECTOR],
      },
    ],
  },
];

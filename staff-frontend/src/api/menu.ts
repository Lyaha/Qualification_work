import { getRequest } from './request';

export interface MenuItem {
  id: string;
  translations: {
    uk: string;
    en: string;
  };
  path: string;
  icon?: string;
  allowedRoles: string[];
  children?: MenuItem[];
  title?: string; // будет добавляться на фронтенде после локализации
}

export const getMenu = async (): Promise<MenuItem[]> => {
  return getRequest<MenuItem[]>('/menu');
};

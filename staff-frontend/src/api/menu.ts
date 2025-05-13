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

export interface AccessResponse {
  hasAccess: boolean;
}

export const getMenu = async (): Promise<MenuItem[]> => {
  return getRequest<MenuItem[]>('/menu');
};

export const checkAccess = async (path: string): Promise<AccessResponse> => {
  return getRequest<AccessResponse>(`/menu/check-access?path=${encodeURIComponent(path)}`);
};

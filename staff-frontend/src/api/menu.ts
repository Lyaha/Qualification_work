import { getRequest } from './request';

export interface MenuItem {
  id: string;
  translations: {
    uk: string;
    en: string;
  };
  path: string;
  icon?: string;
  children?: MenuItem[];
}

export const getMenu = async (): Promise<MenuItem[]> => {
  return getRequest<MenuItem[]>('/menu');
};

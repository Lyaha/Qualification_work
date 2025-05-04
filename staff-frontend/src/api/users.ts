import { getRequest } from './request';

export const checkIsStaff = async (): Promise<boolean> => {
  return getRequest<boolean>('/users/auth-staff');
};

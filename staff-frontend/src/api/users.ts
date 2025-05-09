import { getRequest } from './request';
import { User } from './entity/user';

export const checkIsStaff = async (): Promise<boolean> => {
  return getRequest<boolean>('/users/auth-staff');
};

export const UserInfo = async (): Promise<User> => {
  return getRequest<User>(`/users/me`);
};

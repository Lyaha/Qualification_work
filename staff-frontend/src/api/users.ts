import { deleteRequest, getRequest, postRequest, putRequest } from './request';
import { User } from './entity/user';

export const checkIsStaff = async (): Promise<boolean> => {
  return getRequest<boolean>('/users/auth-staff');
};

export const getManagers = async (): Promise<User[]> => {
  return getRequest<User[]>('/users/managers');
};

export const getClients = async (): Promise<User[]> => {
  return getRequest<User[]>('/users/clients');
};

export const UserInfo = async (): Promise<User> => {
  return getRequest<User>(`/users/me`);
};

export const getUsers = async (): Promise<User[]> => {
  return getRequest<User[]>('/users');
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  return postRequest<User>('/users', user);
};

export const updateUser = async (id: string, user: Partial<User>): Promise<User> => {
  return putRequest<User>(`/users/${id}`, user);
};

export const deleteUser = async (id: string): Promise<void> => {
  return deleteRequest(`/users/${id}`);
};

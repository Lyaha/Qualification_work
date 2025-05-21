import { UserWarehouse } from './entity/userWarehouse';
import { deleteRequest, getRequest, postRequest, putRequest } from './request';

export const getAllUserWarehouses = async (): Promise<UserWarehouse[]> => {
  return await getRequest(`/user-warehouse`);
};

export const deleteUserWarehouse = async (id: string): Promise<void> => {
  return deleteRequest(`/user-warehouse/${id}`);
};

export const createUserWarehouse = async (
  data: Omit<UserWarehouse, 'id'>,
): Promise<UserWarehouse> => {
  return await postRequest('/user-warehouse', data);
};

export const updateUserWarehouse = async (
  id: string,
  data: Omit<UserWarehouse, 'id'>,
): Promise<UserWarehouse> => {
  return await putRequest(`/user-warehouse/${id}`, data);
};

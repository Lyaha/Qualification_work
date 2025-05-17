import { Warehouse } from './entity/warehouse';
import { deleteRequest, getRequest, postRequest } from './request';

export const getWarehouses = async (): Promise<Warehouse[]> => {
  return await getRequest(`/warehouses`);
};

export const deleteWarehouses = async (id: string): Promise<void> => {
  return deleteRequest(`/warehouses/${id}`);
};

export const createWarehouses = async (data: Omit<Warehouse, 'id'>): Promise<Warehouse> => {
  return await postRequest('/warehouses', data);
};

import { getRequest, postRequest, putRequest, deleteRequest } from './request';
import { SupplyOrder } from './entity/supplyOrder';

export const getAllSupplyOrders = async (): Promise<SupplyOrder[]> => {
  return getRequest<SupplyOrder[]>('/supply-order');
};

export const getSupplyOrder = async (id: string): Promise<SupplyOrder> => {
  return getRequest<SupplyOrder>(`/supply-order/${id}`);
};

export const createSupplyOrder = async (product: Omit<SupplyOrder, 'id'>): Promise<SupplyOrder> => {
  return postRequest<SupplyOrder>('/supply-order', product);
};

export const updateSupplyOrder = async (
  id: string,
  product: Partial<SupplyOrder>,
): Promise<SupplyOrder> => {
  return putRequest<SupplyOrder>(`/supply-order/${id}`, product);
};

export const deleteSupplyOrder = async (id: string): Promise<void> => {
  return deleteRequest(`/supply-order/${id}`);
};

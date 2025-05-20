import { getRequest, postRequest, putRequest, deleteRequest } from './request';
import { SupplyOrderItem } from './entity/supplyOrderItem';

export const getAllSupplyOrderItems = async (): Promise<SupplyOrderItem[]> => {
  return getRequest<SupplyOrderItem[]>('/supply-order-item');
};

export const getSupplyOrderItemsBySupplyOrderId = async (
  id: string,
): Promise<SupplyOrderItem[]> => {
  return getRequest<SupplyOrderItem[]>(`/supply-order-item/supply-order/${id}`);
};

export const getSupplyOrderItem = async (id: string): Promise<SupplyOrderItem> => {
  return getRequest<SupplyOrderItem>(`/supply-order-item/${id}`);
};

export const createSupplyOrderItem = async (
  product: Omit<SupplyOrderItem, 'id'>,
): Promise<SupplyOrderItem> => {
  return postRequest<SupplyOrderItem>('/supply-order-item', product);
};

export const updateSupplyOrderItem = async (
  id: string,
  product: Partial<SupplyOrderItem>,
): Promise<SupplyOrderItem> => {
  return putRequest<SupplyOrderItem>(`/supply-order-item/${id}`, product);
};

export const deleteSupplyOrderItem = async (id: string): Promise<void> => {
  return deleteRequest(`/supply-order-item/${id}`);
};

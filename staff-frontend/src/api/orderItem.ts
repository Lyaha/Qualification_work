import { getRequest, postRequest, putRequest, deleteRequest } from './request';
import { OrderItem } from './entity/orderItem';

export const getAllOrderItems = async (): Promise<OrderItem[]> => {
  return getRequest<OrderItem[]>('/order-item');
};

export const getOrderItem = async (id: string): Promise<OrderItem> => {
  return getRequest<OrderItem>(`/order-item/${id}`);
};

export const createOrderItem = async (product: Omit<OrderItem, 'id'>): Promise<OrderItem> => {
  return postRequest<OrderItem>('/order-item', product);
};

export const getOrderItemsByOrderId = async (orderId: string): Promise<OrderItem[]> => {
  return getRequest<OrderItem[]>(`/order-item/order/${orderId}`);
};

export const updateOrderItem = async (
  id: string,
  product: Partial<OrderItem>,
): Promise<OrderItem> => {
  return putRequest<OrderItem>(`/order-item/${id}`, product);
};

export const deleteOrderItem = async (id: string): Promise<void> => {
  return deleteRequest(`/order-item/${id}`);
};

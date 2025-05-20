import { getRequest, postRequest, putRequest, deleteRequest } from './request';
import { Order } from './entity/order';

export const getAllOrders = async (): Promise<Order[]> => {
  return getRequest<Order[]>('/order');
};

export const getOrder = async (id: string): Promise<Order> => {
  return getRequest<Order>(`/order/${id}`);
};

export const createOrder = async (product: Omit<Order, 'id'>): Promise<Order> => {
  return postRequest<Order>('/order', product);
};

export const updateOrder = async (id: string, product: Partial<Order>): Promise<Order> => {
  return putRequest<Order>(`/order/${id}`, product);
};

export const deleteOrder = async (id: string): Promise<void> => {
  return deleteRequest(`/order/${id}`);
};

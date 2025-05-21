import { getRequest, postRequest, putRequest, deleteRequest } from './request';
import { Discount } from './entity/discount';

export const getAllDiscounts = async (): Promise<Discount[]> => {
  return getRequest<Discount[]>('/discount');
};

export const getDiscount = async (id: string): Promise<Discount> => {
  return getRequest<Discount>(`/discount/${id}`);
};

export const createDiscount = async (product: Omit<Discount, 'id'>): Promise<Discount> => {
  return postRequest<Discount>('/discount', product);
};

export const updateDiscount = async (id: string, product: Partial<Discount>): Promise<Discount> => {
  return putRequest<Discount>(`/discount/${id}`, product);
};

export const deleteDiscount = async (id: string): Promise<void> => {
  return deleteRequest(`/discount/${id}`);
};

import { getRequest, postRequest, putRequest, deleteRequest } from './request';
import { Supplier } from './entity/supplier';

export const getAllSuppliers = async (): Promise<Supplier[]> => {
  return getRequest<Supplier[]>('/supplier');
};

export const getSupplier = async (id: string): Promise<Supplier> => {
  return getRequest<Supplier>(`/supplier/${id}`);
};

export const createSupplier = async (product: Omit<Supplier, 'id'>): Promise<Supplier> => {
  return postRequest<Supplier>('/supplier', product);
};

export const updateSupplier = async (id: string, product: Partial<Supplier>): Promise<Supplier> => {
  return putRequest<Supplier>(`/supplier/${id}`, product);
};

export const deleteSupplier = async (id: string): Promise<void> => {
  return deleteRequest(`/supplier/${id}`);
};

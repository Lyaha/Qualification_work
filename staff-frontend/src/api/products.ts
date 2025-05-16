import { getRequest, postRequest, putRequest, deleteRequest } from './request';
import { CustomEditAddProduct, Product } from './entity/product';

export const getProducts = async (): Promise<Product[]> => {
  return getRequest<Product[]>('/products');
};

export const getProduct = async (id: string): Promise<Product> => {
  return getRequest<Product>(`/products/${id}`);
};

export const createProduct = async (
  product: Omit<CustomEditAddProduct, 'id'>,
): Promise<Product> => {
  return postRequest<Product>('/products', product);
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  return putRequest<Product>(`/products/${id}`, product);
};

export const deleteProduct = async (id: string): Promise<void> => {
  return deleteRequest(`/products/${id}`);
};

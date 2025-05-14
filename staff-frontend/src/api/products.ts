import { getRequest, postRequest, putRequest, deleteRequest } from './request';
import { Product } from './entity/product';

export interface ProductResponse {
  items: Product[];
  total: number;
}

export const getProducts = async (): Promise<ProductResponse> => {
  return getRequest<ProductResponse>(`/products`);
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  return postRequest<Product>('/products', product);
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  return putRequest<Product>(`/products/${id}`, product);
};

export const deleteProduct = async (id: string): Promise<void> => {
  return deleteRequest(`/products/${id}`);
};

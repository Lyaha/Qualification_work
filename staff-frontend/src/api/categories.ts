import { getRequest, postRequest, putRequest, deleteRequest } from './request';
import { Category } from './entity/category';

export const getCategories = async (): Promise<Category[]> => {
  return getRequest<Category[]>('/category');
};

export const getCategory = async (id: string): Promise<Category> => {
  return getRequest<Category>(`/category/${id}`);
};

export const createCategory = async (Category: Omit<Category, 'id'>): Promise<Category> => {
  return postRequest<Category>('/category', Category);
};

export const updateCategory = async (
  id: string,
  Category: Partial<Category>,
): Promise<Category> => {
  return putRequest<Category>(`/category/${id}`, Category);
};

export const deleteCategory = async (id: string): Promise<void> => {
  return deleteRequest(`/category/${id}`);
};

import { Batch } from './entity/batch';
import { Task } from './entity/task';
import { deleteRequest, getRequest, postRequest, putRequest } from './request';

export const getBatchesByProduct = async (productId: string): Promise<Batch[]> => {
  return await getRequest(`/batch/product/${productId}`);
};

export const getAllBatches = async (): Promise<Batch[]> => {
  return await getRequest(`/batch`);
};

export const deleteBatches = async (id: string): Promise<void> => {
  return deleteRequest(`/batch/${id}`);
};

export const createBatch = async (data: Omit<Batch, 'id'>): Promise<Batch> => {
  return postRequest('/batch/', data);
};

export const updateBatch = async (id: string, data: Omit<Batch, 'id'>): Promise<Batch> => {
  return putRequest(`/batch/${id}`, data);
};

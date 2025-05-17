import { deleteRequest, getRequest, postRequest, putRequest } from './request';
import { BatchLocation } from './entity/batchLoacation';

export const getByBatchId = async (batchId: string): Promise<BatchLocation> => {
  return await getRequest(`/batch-locations/batch/${batchId}`);
};

export const get = async (): Promise<BatchLocation[]> => {
  return await getRequest(`/batch-locations`);
};

export const create = async (data: Partial<BatchLocation>): Promise<BatchLocation> => {
  return await postRequest(`/batch-locations`, data);
};

export const update = async (id: string, data: Partial<BatchLocation>): Promise<BatchLocation> => {
  return await putRequest(`/batch-locations/${id}`, data);
};

export const deleteById = async (id: string): Promise<void> => {
  return await deleteRequest(`/batch-locations/${id}`);
};

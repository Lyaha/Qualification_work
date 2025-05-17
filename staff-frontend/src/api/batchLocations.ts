import { deleteRequest, getRequest, postRequest, putRequest } from './request';
import { BatchLocation } from './entity/batchLoacation';

export const getByBatchId = async (batchId: string): Promise<BatchLocation[]> => {
  return await getRequest(`/batch-locations/batch/${batchId}`);
};

export const getAllLocationBatches = async (): Promise<BatchLocation[]> => {
  return await getRequest(`/batch-locations`);
};

export const createLocationBatches = async (
  data: Omit<BatchLocation, 'id'>,
): Promise<BatchLocation> => {
  return await postRequest(`/batch-locations`, data);
};

export const updateLocationBatches = async (
  id: string,
  data: Partial<BatchLocation>,
): Promise<BatchLocation> => {
  return await putRequest(`/batch-locations/${id}`, data);
};

export const deleteLocationBatches = async (id: string): Promise<void> => {
  return await deleteRequest(`/batch-locations/${id}`);
};

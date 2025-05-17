import { deleteRequest, getRequest, postRequest, putRequest } from './request';
import { StorageZone } from './entity/storageZone';

export const getAllStorageZone = async (): Promise<StorageZone[]> => {
  return await getRequest(`/storage-zone`);
};

export const createStorageZone = async (data: Omit<StorageZone, 'id'>): Promise<StorageZone> => {
  return await postRequest(`/storage-zone`, data);
};

export const updateStorageZone = async (
  id: string,
  data: Partial<StorageZone>,
): Promise<StorageZone> => {
  return await putRequest(`/storage-zone/${id}`, data);
};

export const deleteStorageZoneById = async (id: string): Promise<void> => {
  return await deleteRequest(`/storage-zone/${id}`);
};

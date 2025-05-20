import { deleteRequest, getRequest, postRequest, putRequest } from './request';
import { StorageZone } from './entity/storageZone';

export const getAllStorageZones = async (): Promise<StorageZone[]> => {
  return await getRequest(`/storage-zone`);
};

export const createStorageZone = async (data: Omit<StorageZone, 'id'>): Promise<StorageZone> => {
  return await postRequest(`/storage-zone`, data);
};

export const getStorageZonesByWarehouse = async (warehouseId: string): Promise<StorageZone[]> => {
  return await getRequest(`/storage-zone/by-warehouse/${warehouseId}`);
};

export const updateStorageZone = async (
  id: string,
  data: Partial<StorageZone>,
): Promise<StorageZone> => {
  return await putRequest(`/storage-zone/${id}`, data);
};

export const deleteStorageZone = async (id: string): Promise<void> => {
  return await deleteRequest(`/storage-zone/${id}`);
};

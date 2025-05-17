import { deleteRequest, getRequest, postRequest, putRequest } from './request';
import { Box } from './entity/box';

export const getAllBox = async (): Promise<Box[]> => {
  return await getRequest(`/box`);
};

export const createBox = async (data: Omit<Box, 'id'>): Promise<Box> => {
  return await postRequest(`/box`, data);
};

export const updateBox = async (id: string, data: Partial<Box>): Promise<Box> => {
  return await putRequest(`/box/${id}`, data);
};

export const deleteBoxById = async (id: string): Promise<void> => {
  return await deleteRequest(`/box/${id}`);
};

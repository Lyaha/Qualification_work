import { getRequest, postRequest, putRequest, deleteRequest } from './request';
import { InventoryMovement } from './entity/inventoryMovement';

export const getAllMovements = async (): Promise<InventoryMovement[]> => {
  return getRequest<InventoryMovement[]>('/inventory-movement');
};

export const getMovement = async (id: string): Promise<InventoryMovement> => {
  return getRequest<InventoryMovement>(`/inventory-movement/${id}`);
};

export const createMovement = async (
  product: Omit<InventoryMovement, 'id'>,
): Promise<InventoryMovement> => {
  return postRequest<InventoryMovement>('/inventory-movement', product);
};

export const updateMovement = async (
  id: string,
  product: Partial<InventoryMovement>,
): Promise<InventoryMovement> => {
  return putRequest<InventoryMovement>(`/inventory-movement/${id}`, product);
};

export const deleteMovement = async (id: string): Promise<void> => {
  return deleteRequest(`/inventory-movement/${id}`);
};

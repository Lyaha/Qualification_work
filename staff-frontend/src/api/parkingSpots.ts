import { getRequest, postRequest, putRequest, deleteRequest } from './request';
import { ParkingSpot } from './entity/parkingSpot';

export const getAllParkingSpots = async (): Promise<ParkingSpot[]> => {
  return getRequest<ParkingSpot[]>('/parking-spot');
};

export const getParkingSpot = async (id: string): Promise<ParkingSpot> => {
  return getRequest<ParkingSpot>(`/parking-spot/${id}`);
};

export const createParkingSpot = async (product: Omit<ParkingSpot, 'id'>): Promise<ParkingSpot> => {
  return postRequest<ParkingSpot>('/parking-spot', product);
};

export const updateParkingSpot = async (
  id: string,
  product: Partial<ParkingSpot>,
): Promise<ParkingSpot> => {
  return putRequest<ParkingSpot>(`/parking-spot/${id}`, product);
};

export const deleteParkingSpot = async (id: string): Promise<void> => {
  return deleteRequest(`/parking-spot/${id}`);
};

export type ParkingSpotStatus = 'available' | 'reserved' | 'occupied';

export type ParkingSpot = {
  id: string;
  warehouse_id: string;
  status: ParkingSpotStatus;
  reserved_until?: string;
  reference_id?: string;
  entity_type?: string;
};

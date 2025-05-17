export type BatchLocation = {
  id: string;
  batch_id: string;
  storage_zone_id?: string;
  box_id?: string;
  quantity: number;
  created_at: string;
  storage_zone?: {
    id: string;
    location_code: string;
    warehouse_id: string;
    max_weight: number;
  };
  box?: {
    id: string;
    name: string;
    description?: string;
    length: number;
    width: number;
    height: number;
    max_weight: number;
  };
};

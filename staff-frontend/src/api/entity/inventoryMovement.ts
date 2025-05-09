export type MovementType = 'incoming' | 'outgoing' | 'transfer';

export type InventoryMovement = {
  id: string;
  product_id: string;
  from_zone_id?: string;
  to_zone_id?: string;
  quantity: number;
  movement_type: MovementType;
  user_id: string;
  created_at: string;
  reference_id?: string;
  note?: string;
};

export type SupplyOrderStatus = 'draft' | 'confirmed' | 'delivered' | 'completed';

export type SupplyOrder = {
  id: string;
  supplier_id: string;
  status: SupplyOrderStatus;
  expected_delivery_date: string;
  created_at: string;
  warehouse_id: string;
};

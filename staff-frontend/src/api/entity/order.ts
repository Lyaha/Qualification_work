export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'canceled';

export type Order = {
  id: string;
  client_id: string;
  total_amount: number;
  status: OrderStatus;
  payment_method?: string;
  created_at: string;
  warehouse_id: string;
};

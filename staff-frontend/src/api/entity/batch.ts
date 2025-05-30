export type Batch = {
  id: string;
  product_id: string;
  warehouse_id: string;
  quantity: number;
  expiration_date?: string;
  received_at?: string;
  product?: {
    id: string;
    name: string;
    category: string;
    price: number;
  };
};

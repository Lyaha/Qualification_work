export type Review = {
  id: string;
  user_id: string;
  product_id?: string;
  order_id?: string;
  rating: number;
  comment?: string;
  created_at: string;
};

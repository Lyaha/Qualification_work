export type Product = {
  id: string;
  name: string;
  description?: string;
  category_id: string;
  barcode?: string;
  price_purchase: number;
  price: number;
  weight?: number;
  expiration_date?: string;
  warehouse_id: string;
  storage_location?: string;
};

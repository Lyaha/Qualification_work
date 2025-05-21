import { Category } from './category';

export type Product = {
  id: string;
  name: string;
  description?: string;
  category_id: string;
  category_entity?: Category;
  barcode?: string;
  price_purchase: number;
  price: number;
  weight?: number;
  updated_at?: string;
};

export type CustomEditAddProduct = {
  name: string;
  description?: string;
  category_id: string;
  category?: Category;
  barcode?: string;
  price_purchase: number;
  price: number;
  weight?: number;
};

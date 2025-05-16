import { Category } from './category';

export type Product = {
  id: string;
  name: string;
  description?: string;
  category: string;
  category_entity: Category;
  barcode?: string;
  price_purchase: number;
  price: number;
  weight?: number;
  updated_at?: string;
};

export type CustomEditAddProduct = {
  name: string;
  description?: string;
  category_id: Category;
  category?: string;
  barcode?: string;
  price_purchase: number;
  price: number;
  weight?: number;
};

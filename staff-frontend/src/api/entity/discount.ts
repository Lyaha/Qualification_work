export type DiscountType = 'percentage' | 'fixed';
export type DiscountTarget = 'product' | 'category';

export type Discount = {
  id: string;
  name: string;
  product_id?: string;
  category_id?: string;
  discount_type: DiscountType;
  targetType?: DiscountTarget;
  value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  min_quantity?: number;
  is_stackable: boolean;
};

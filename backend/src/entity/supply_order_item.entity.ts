import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { SupplyOrder } from './supply_order.entity';
import { Product } from './product.entity';

@Entity('supply_order_items')
export class SupplyOrderItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => SupplyOrder)
  supply_order!: SupplyOrder;

  @ManyToOne(() => Product)
  product!: Product;

  @Column()
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price!: number;
}

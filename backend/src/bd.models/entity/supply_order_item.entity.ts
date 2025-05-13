import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SupplyOrder } from './supply_order.entity';
import { Product } from './product.entity';

@Entity('supply_order_items')
export class SupplyOrderItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => SupplyOrder)
  @JoinColumn({ name: 'supply_order_id' })
  supply_order!: SupplyOrder;

  @Column()
  supply_order_id!: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @Column()
  product_id!: string;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price!: number;
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' }) // Укажите имя внешнего ключа
  order!: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' }) // Укажите имя внешнего ключа
  product!: Product;

  @Column()
  product_id!: string;

  @Column()
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price!: number;
}

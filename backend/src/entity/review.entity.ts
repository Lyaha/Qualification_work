import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';
import { Order } from './order.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' }) // Укажите имя внешнего ключа
  user!: User;

  @ManyToOne(() => Product, { nullable: true })
  @JoinColumn({ name: 'product_id' }) // Укажите имя внешнего ключа
  product!: Product;

  @ManyToOne(() => Order, { nullable: true })
  @JoinColumn({ name: 'order_id' }) // Укажите имя внешнего ключа
  order!: Order;

  @Column({ type: 'smallint' })
  rating!: number;

  @Column({ type: 'text', nullable: true })
  comment!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
}

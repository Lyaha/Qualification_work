import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity('price_history')
export class PriceHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @Column()
  product_id!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  old_price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  new_price!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'changed_by' })
  changed_by_user!: User;

  @Column()
  changed_by!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  changed_at!: Date;
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import { Warehouse } from './warehouse.entity';

@Entity('batches')
export class Batch {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @Column()
  product_id!: string;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse!: Warehouse;

  @Column()
  warehouse_id!: string;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'date', nullable: true })
  expiration_date!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  received_at!: Date;
}

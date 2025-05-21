import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';
import { Warehouse } from './warehouse.entity';
import { BatchLocation } from './batch-location.entity';

@Entity('batches')
export class Batch {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @Column('uuid')
  product_id!: string;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse!: Warehouse;

  @Column('uuid')
  warehouse_id!: string;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'int', default: 0 })
  current_quantity!: number;

  @Column({ type: 'date', nullable: true })
  expiration_date!: Date;

  @CreateDateColumn()
  received_at!: Date;

  @OneToMany(() => BatchLocation, (location) => location.batch)
  locations!: BatchLocation[];
}

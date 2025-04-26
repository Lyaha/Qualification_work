import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from './category.entity';
import { Warehouse } from './warehouse.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @ManyToOne(() => Category)
  category!: Category;

  @Column({ unique: true, nullable: true })
  barcode!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price_purchase!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  weight!: number;

  @Column({ type: 'date', nullable: true })
  expiration_date!: Date;

  @ManyToOne(() => Warehouse)
  warehouse!: Warehouse;

  @Column({ nullable: true })
  storage_location!: string;
}

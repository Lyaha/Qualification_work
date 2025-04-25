
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

@Entity('discounts')
export class Discount {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'uuid', nullable: true })
  product_id!: string;

  @Column({ type: 'uuid', nullable: true })
  category_id!: string;

  @Column({ type: 'enum', enum: DiscountType })
  discount_type!: DiscountType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value!: number;

  @Column({ type: 'timestamp' })
  start_date!: Date;

  @Column({ type: 'timestamp' })
  end_date!: Date;

  @Column({ default: true })
  is_active!: boolean;
}

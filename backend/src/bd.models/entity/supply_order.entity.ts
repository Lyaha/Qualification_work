import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Supplier } from './supplier.entity';

export enum SupplyOrderStatus {
  DRAFT = 'draft',
  CONFIRMED = 'confirmed',
  DELIVERED = 'delivered',
}

@Entity('supply_orders')
export class SupplyOrder {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier!: Supplier;

  @Column()
  supplier_id!: string;

  @Column({
    type: 'enum',
    enum: SupplyOrderStatus,
  })
  status!: SupplyOrderStatus;

  @Column({ type: 'date' })
  expected_delivery_date!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Warehouse } from './warehouse.entity';

export enum SupplyOrderStatus {
  DRAFT = 'draft',
  CONFIRMED = 'confirmed',
  DELIVERED = 'delivered',
}

@Entity('supply_orders')
export class SupplyOrder {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @ManyToOne(() => Warehouse)
  warehouse!: Warehouse;

  @Column({ type: 'enum', enum: SupplyOrderStatus })
  status!: SupplyOrderStatus;
}

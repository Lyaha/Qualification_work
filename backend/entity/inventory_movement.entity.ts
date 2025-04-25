
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum MovementType {
  INCOMING = 'incoming',
  OUTGOING = 'outgoing',
  TRANSFER = 'transfer',
}

@Entity('inventory_movements')
export class InventoryMovement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  product_id!: string;

  @Column()
  from_zone_id!: string;

  @Column()
  to_zone_id!: string;

  @Column()
  quantity!: number;

  @Column({ type: 'enum', enum: MovementType })
  movement_type!: MovementType;

  @Column()
  user_id!: string;

  @Column({ type: 'timestamp' })
  created_at!: Date;
}

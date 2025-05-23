import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Warehouse } from './warehouse.entity';

@Entity('storage_zones')
export class StorageZone {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse!: Warehouse;

  @Column()
  warehouse_id!: string;

  @Column({ length: 50 })
  location_code!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  max_weight!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  current_weight!: number;
}

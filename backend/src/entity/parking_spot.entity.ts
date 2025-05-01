import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Warehouse } from './warehouse.entity';

export enum ParkingSpotStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  OCCUPIED = 'occupied',
}

@Entity('parking_spots')
export class ParkingSpot {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse!: Warehouse;

  @Column()
  warehouse_id!: string;

  @Column({
    type: 'enum',
    enum: ParkingSpotStatus,
  })
  status!: ParkingSpotStatus;

  @Column({ type: 'timestamp', nullable: true })
  reserved_until!: Date;

  @Column({ type: 'uuid', nullable: true })
  reference_id!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  entity_type!: string;
}

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum ParkingSpotStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  OCCUPIED = 'occupied',
}

@Entity('parking_spots')
export class ParkingSpot {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  location!: string;

  @Column({ type: 'enum', enum: ParkingSpotStatus })
  status!: ParkingSpotStatus;

  @Column({ nullable: true })
  warehouse_id!: string;
}

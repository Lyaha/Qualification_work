import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Warehouse } from './warehouse.entity';

@Entity('storage_zones')
export class StorageZone {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'Associated warehouse' })
  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse!: Warehouse;

  @ApiProperty({ description: 'Warehouse identifier' })
  @Column()
  warehouse_id!: string;

  @ApiProperty({ description: 'Zone location code', maxLength: 50 })
  @Column({ length: 50 })
  location_code!: string;

  @ApiProperty({ description: 'Maximum allowed weight' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  max_weight!: number;

  @ApiProperty({ description: 'Current weight in zone' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  current_weight!: number;
}

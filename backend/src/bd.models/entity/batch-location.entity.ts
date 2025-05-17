import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Batch } from './batch.entity';
import { StorageZone } from './storage_zone.entity';
import { Box } from './box.entity';

@Entity('batch_locations')
export class BatchLocation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Batch, (batch) => batch.locations)
  @JoinColumn({ name: 'batch_id' })
  batch!: Batch;

  @Column('uuid')
  batch_id!: string;

  @ManyToOne(() => StorageZone, { nullable: true })
  @JoinColumn({ name: 'storage_zone_id' })
  storage_zone!: StorageZone;

  @Column('uuid', { nullable: true })
  storage_zone_id!: string;

  @ManyToOne(() => Box, { nullable: true })
  @JoinColumn({ name: 'box_id' })
  box!: Box;

  @Column('uuid', { nullable: true })
  box_id!: string;

  @Column('int')
  quantity!: number;

  @CreateDateColumn()
  created_at!: Date;
}

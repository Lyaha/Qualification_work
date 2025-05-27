import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('warehouses')
export class Warehouse {
  @ApiProperty({ description: 'Unique warehouse identifier' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'Warehouse name' })
  @Column()
  name!: string;

  @ApiProperty({ description: 'Physical location' })
  @Column()
  location!: string;

  @ApiProperty({ description: 'Working hours schedule' })
  @Column({ type: 'text', nullable: true })
  working_hours!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'manager_id' })
  manager!: User;

  @ApiProperty({ description: 'Manager ID' })
  @Column('uuid')
  manager_id!: string;

  @ApiProperty({ description: 'Is the warehouse active?' })
  @Column()
  is_active!: boolean;
}

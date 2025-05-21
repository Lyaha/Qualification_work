import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('warehouses')
export class Warehouse {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  location!: string;

  @Column({ type: 'text' })
  working_hours!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'manager_id' })
  manager!: User;

  @Column('uuid')
  manager_id!: string;

  @Column('uuid')
  warehouse_id!: string;

  @Column()
  is_active!: boolean;
}

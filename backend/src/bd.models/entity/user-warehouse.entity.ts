import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('warehouses')
export class UserWarehouse {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  location!: string;

  @Column({ type: 'text' })
  working_hours!: string;

  @Column('uuid')
  user_id!: string;

  @Column('uuid')
  warehouse_id!: string;

  @CreateDateColumn()
  assigned_at!: Date;
}

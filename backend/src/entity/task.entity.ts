import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { OrderItem } from './order_item.entity';
import { SupplyOrderItem } from './supply_order_item.entity';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'worker_id' })
  worker!: User;

  @Column()
  worker_id!: string;

  @ManyToOne(() => OrderItem, { nullable: true })
  @JoinColumn({ name: 'order_item_id' })
  orderItem?: OrderItem;

  @Column({ nullable: true })
  order_item_id?: string;

  @ManyToOne(() => SupplyOrderItem, { nullable: true })
  @JoinColumn({ name: 'supply_order_item_id' })
  supplyOrderItem?: SupplyOrderItem;

  @Column({ nullable: true })
  supply_order_item_id?: string;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'date' })
  deadline!: Date;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status!: TaskStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed_at?: Date;

  @Column({ type: 'text', nullable: true })
  note?: string;
}

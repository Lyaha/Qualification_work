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

  @Column()
  worker_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'worker_id' })
  worker!: User;

  @Column({ nullable: true })
  order_item_id!: string;

  @ManyToOne(() => OrderItem, { nullable: true })
  @JoinColumn({ name: 'order_item_id' })
  order_item!: OrderItem;

  @Column({ nullable: true })
  supply_order_item_id!: string;

  @ManyToOne(() => SupplyOrderItem, { nullable: true })
  @JoinColumn({ name: 'supply_order_item_id' })
  supply_order_item!: SupplyOrderItem;

  @Column()
  quantity!: number;

  @Column()
  deadline!: Date;

  @Column({ default: 'pending' })
  status!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed_at!: Date;

  @Column({ type: 'text', nullable: true })
  note!: string;
}

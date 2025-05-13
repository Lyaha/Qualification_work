import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  client_id!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount!: number;

  @Column({ type: 'enum', enum: OrderStatus })
  status!: OrderStatus;

  @Column()
  payment_method!: string;

  @Column({ type: 'timestamp' })
  created_at!: Date;
}

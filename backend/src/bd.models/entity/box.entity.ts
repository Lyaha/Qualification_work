import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('boxes')
export class Box {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  length!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  width!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  height!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  max_weight!: number;
}

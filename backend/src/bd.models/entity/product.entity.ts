import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import { IsString, IsNumber, IsUUID, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsNumber()
  price_purchase!: number;

  @IsNumber()
  price!: number;

  @IsUUID()
  category_id!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  barcode?: string;

  @IsNumber()
  @IsOptional()
  weight?: number;
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column()
  category!: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' }) // внешний ключ
  category_entity!: Category;

  @Column({ unique: true, nullable: true, length: 50 })
  barcode!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price_purchase!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  weight!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;
}

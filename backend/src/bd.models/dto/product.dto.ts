import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsUUID, IsOptional } from 'class-validator';
import { BaseDto } from './base.dto';

export class CreateProductDto extends BaseDto {
  @ApiProperty({ example: 'Product name', description: 'Product name' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 10.99, description: 'Purchase price' })
  @IsNumber()
  price_purchase!: number;

  @ApiProperty({ example: 15.99, description: 'Selling price' })
  @IsNumber()
  price!: number;

  @ApiProperty({ description: 'Category UUID' })
  @IsUUID()
  category_id!: string;

  @ApiProperty({ required: false, description: 'Product description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false, example: '1234567890', description: 'Product barcode' })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiProperty({ required: false, example: 1.5, description: 'Product weight in kg' })
  @IsNumber()
  @IsOptional()
  weight?: number;
}

export class UpdateProductDto extends CreateProductDto {}

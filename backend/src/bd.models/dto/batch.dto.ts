import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsDate, IsOptional } from 'class-validator';
import { BaseDto } from './base.dto';

export class CreateBatchDto extends BaseDto {
  @ApiProperty({ description: 'Product in this batch' })
  @IsUUID()
  product_id!: string;

  @ApiProperty({ description: 'Warehouse location' })
  @IsUUID()
  warehouse_id!: string;

  @ApiProperty({ description: 'Initial quantity', minimum: 1 })
  @IsNumber()
  quantity!: number;

  @ApiProperty({ description: 'Current available quantity', default: 0 })
  @IsNumber()
  current_quantity!: number;

  @ApiProperty({ description: 'Expiration date', required: false })
  @IsDate()
  @IsOptional()
  expiration_date?: Date;
}

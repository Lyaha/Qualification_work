import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min } from 'class-validator';
import { BaseDto } from './base.dto';

export class CreateSupplyOrderItemDto extends BaseDto {
  @ApiProperty({ description: 'Supply order reference' })
  @IsUUID()
  supply_order_id!: string;

  @ApiProperty({ description: 'Product being ordered' })
  @IsUUID()
  product_id!: string;

  @ApiProperty({ description: 'Order quantity', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiProperty({ description: 'Price per unit' })
  @IsNumber()
  unit_price!: number;
}

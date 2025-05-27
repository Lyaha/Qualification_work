import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber } from 'class-validator';
import { BaseDto } from './base.dto';

export class CreateOrderItemDto extends BaseDto {
  @ApiProperty({ description: 'Order ID' })
  @IsUUID()
  order_id!: string;

  @ApiProperty({ description: 'Product ID being ordered' })
  @IsUUID()
  product_id!: string;

  @ApiProperty({ description: 'Quantity ordered', minimum: 1 })
  @IsNumber()
  quantity!: number;

  @ApiProperty({ description: 'Price per unit' })
  @IsNumber()
  unit_price!: number;
}

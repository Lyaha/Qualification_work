import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsString, IsNumber, IsDate } from 'class-validator';
import { OrderStatus } from '../entity/order.entity';
import { BaseDto } from './base.dto';

export class CreateOrderDto extends BaseDto {
  @ApiProperty({ description: 'Client ID who placed the order' })
  @IsUUID()
  client_id!: string;

  @ApiProperty({ description: 'Total order amount' })
  @IsNumber()
  total_amount!: number;

  @ApiProperty({ enum: OrderStatus, description: 'Current order status' })
  @IsEnum(OrderStatus)
  status!: OrderStatus;

  @ApiProperty({ description: 'Payment method used' })
  @IsString()
  payment_method!: string;

  @ApiProperty({ description: 'Order creation date' })
  @IsDate()
  created_at!: Date;

  @ApiProperty({ description: 'Warehouse ID where order will be processed' })
  @IsUUID()
  warehouse_id!: string;
}

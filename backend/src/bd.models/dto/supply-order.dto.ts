import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsDate } from 'class-validator';
import { SupplyOrderStatus } from '../entity/supply_order.entity';
import { BaseDto } from './base.dto';

export class CreateSupplyOrderDto extends BaseDto {
  @ApiProperty({ description: 'Supplier ID' })
  @IsUUID()
  supplier_id!: string;

  @ApiProperty({ enum: SupplyOrderStatus, description: 'Order status' })
  @IsEnum(SupplyOrderStatus)
  status!: SupplyOrderStatus;

  @ApiProperty({ description: 'Warehouse ID' })
  @IsUUID()
  warehouse_id!: string;

  @ApiProperty({ description: 'Expected delivery date' })
  @IsDate()
  expected_delivery_date!: Date;
}

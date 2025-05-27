import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { BaseDto } from './base.dto';

export class CreateUserWarehouseDto extends BaseDto {
  @ApiProperty({ description: 'User ID (worker)' })
  @IsUUID()
  user_id!: string;

  @ApiProperty({ description: 'Warehouse ID' })
  @IsUUID()
  warehouse_id!: string;
}

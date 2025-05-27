import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsUUID } from 'class-validator';
import { BaseDto } from './base.dto';

export class CreateStorageZoneDto extends BaseDto {
  @ApiProperty({ description: 'Warehouse this zone belongs to' })
  @IsUUID()
  warehouse_id!: string;

  @ApiProperty({ description: 'Zone location code' })
  @IsString()
  location_code!: string;

  @ApiProperty({ description: 'Maximum weight capacity' })
  @IsNumber()
  max_weight!: number;

  @ApiProperty({ description: 'Current weight in zone' })
  @IsNumber()
  current_weight!: number;
}

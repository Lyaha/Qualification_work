import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsOptional, Min } from 'class-validator';
import { BaseDto } from './base.dto';

export class CreateBatchLocationDto extends BaseDto {
  @ApiProperty({ description: 'Batch identifier' })
  @IsUUID()
  batch_id!: string;

  @ApiProperty({ description: 'Storage zone identifier', required: false })
  @IsUUID()
  @IsOptional()
  storage_zone_id?: string;

  @ApiProperty({ description: 'Box identifier if stored in box', required: false })
  @IsUUID()
  @IsOptional()
  box_id?: string;

  @ApiProperty({ description: 'Quantity in this location', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity!: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber } from 'class-validator';
import { BaseDto } from './base.dto';

export class CreatePriceHistoryDto extends BaseDto {
  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  product_id!: string;

  @ApiProperty({ description: 'Previous price' })
  @IsNumber()
  old_price!: number;

  @ApiProperty({ description: 'New price' })
  @IsNumber()
  new_price!: number;

  @ApiProperty({ description: 'User who made the change' })
  @IsUUID()
  changed_by!: string;
}

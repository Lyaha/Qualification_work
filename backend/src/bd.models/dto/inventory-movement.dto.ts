import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { MovementType } from '../entity/inventory_movement.entity';
import { BaseDto } from './base.dto';

export class CreateInventoryMovementDto extends BaseDto {
  @ApiProperty({ description: 'Product being moved' })
  @IsUUID()
  product_id!: string;

  @ApiProperty({ description: 'Source storage zone', required: false })
  @IsUUID()
  @IsOptional()
  from_zone_id?: string;

  @ApiProperty({ description: 'Destination storage zone' })
  @IsUUID()
  to_zone_id!: string;

  @ApiProperty({ description: 'Quantity being moved' })
  @IsNumber()
  quantity!: number;

  @ApiProperty({ enum: MovementType, description: 'Type of movement' })
  @IsEnum(MovementType)
  movement_type!: MovementType;

  @ApiProperty({ description: 'User performing the movement' })
  @IsUUID()
  user_id!: string;

  @ApiProperty({ description: 'Reference ID (batch, order, etc)', required: false })
  @IsUUID()
  @IsOptional()
  reference_id?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsString()
  @IsOptional()
  note?: string;
}

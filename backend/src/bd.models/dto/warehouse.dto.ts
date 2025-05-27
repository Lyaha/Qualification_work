import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, IsBoolean, Length, IsNotEmpty } from 'class-validator';
import { BaseDto } from './base.dto';

export class CreateWarehouseDto extends BaseDto {
  @ApiProperty({
    example: 'Main Warehouse',
    description: 'Name of the warehouse',
    minLength: 2,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  name!: string;

  @ApiProperty({
    example: '123 Storage St, City, Country',
    description: 'Physical location address',
    minLength: 5,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 255)
  location!: string;

  @ApiProperty({
    example: 'Mon-Fri 9:00-18:00, Sat 10:00-15:00',
    description: 'Working hours schedule',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  working_hours?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID of manager responsible for this warehouse',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  manager_id?: string;

  @ApiProperty({
    description: 'Whether the warehouse is currently active',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateWarehouseDto extends CreateWarehouseDto {}

export class WarehouseResponseDto extends CreateWarehouseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique warehouse identifier',
  })
  @IsUUID()
  id!: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Warehouse creation timestamp',
  })
  created_at?: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Last update timestamp',
  })
  updated_at?: Date;
}

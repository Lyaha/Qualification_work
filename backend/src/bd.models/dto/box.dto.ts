import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { BaseDto } from './base.dto';

export class CreateBoxDto extends BaseDto {
  @ApiProperty({ example: 'Large Box', description: 'Box name/identifier' })
  @IsString()
  name!: string;

  @ApiProperty({ required: false, description: 'Box description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 100, description: 'Box length in cm' })
  @IsNumber()
  length!: number;

  @ApiProperty({ example: 50, description: 'Box width in cm' })
  @IsNumber()
  width!: number;

  @ApiProperty({ example: 50, description: 'Box height in cm' })
  @IsNumber()
  height!: number;

  @ApiProperty({ example: 100, description: 'Maximum weight capacity in kg' })
  @IsNumber()
  max_weight!: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional } from 'class-validator';
import { BaseDto } from './base.dto';

export class CreateCategoryDto extends BaseDto {
  @ApiProperty({ example: 'Electronics', description: 'Category name' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Parent category ID', required: false })
  @IsUUID()
  @IsOptional()
  parent_id?: string;
}

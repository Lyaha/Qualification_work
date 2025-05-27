import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsDate } from 'class-validator';

export class BaseDto {
  @ApiProperty({ description: 'Unique identifier' })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @IsDate()
  @IsOptional()
  created_at?: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @IsDate()
  @IsOptional()
  updated_at?: Date;
}

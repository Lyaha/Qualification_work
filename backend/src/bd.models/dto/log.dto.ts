import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { BaseDto } from './base.dto';

export class CreateLogDto extends BaseDto {
  @ApiProperty({ description: 'User who performed the action' })
  @IsUUID()
  user_id!: string;

  @ApiProperty({ description: 'Description of the action' })
  @IsString()
  action!: string;
}

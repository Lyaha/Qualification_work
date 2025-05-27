import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsNumber, IsDate, IsString, IsOptional } from 'class-validator';
import { TaskStatus } from '../entity/task.entity';
import { BaseDto } from './base.dto';

export class CreateTaskDto extends BaseDto {
  @ApiProperty({ description: 'Worker assigned to task' })
  @IsUUID()
  worker_id!: string;

  @ApiProperty({ description: 'Related order item', required: false })
  @IsUUID()
  @IsOptional()
  order_item_id?: string;

  @ApiProperty({ description: 'Related supply order item', required: false })
  @IsUUID()
  @IsOptional()
  supply_order_item_id?: string;

  @ApiProperty({ description: 'Quantity to process' })
  @IsNumber()
  quantity!: number;

  @ApiProperty({ description: 'Task deadline' })
  @IsDate()
  deadline!: Date;

  @ApiProperty({ enum: TaskStatus, description: 'Current task status' })
  @IsEnum(TaskStatus)
  status!: TaskStatus;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsString()
  @IsOptional()
  note?: string;
}

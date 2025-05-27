import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsDate, IsOptional, IsString } from 'class-validator';
import { ParkingSpotStatus } from '../entity/parking_spot.entity';
import { BaseDto } from './base.dto';

export class CreateParkingSpotDto extends BaseDto {
  @ApiProperty({ description: 'Related warehouse' })
  @IsUUID()
  warehouse_id!: string;

  @ApiProperty({ enum: ParkingSpotStatus, description: 'Spot status' })
  @IsEnum(ParkingSpotStatus)
  status!: ParkingSpotStatus;

  @ApiProperty({ description: 'Reservation end time', required: false })
  @IsDate()
  @IsOptional()
  reserved_until?: Date;

  @ApiProperty({ description: 'Reference entity ID', required: false })
  @IsUUID()
  @IsOptional()
  reference_id?: string;

  @ApiProperty({ description: 'Type of referenced entity', required: false })
  @IsString()
  @IsOptional()
  entity_type?: string;
}

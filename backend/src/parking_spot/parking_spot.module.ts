import { Module } from '@nestjs/common';
import { ParkingSpotService } from './parking_spot.service';
import { ParkingSpotController } from './parking_spot.controller';
import { ParkingSpot } from '../entity/parking_spot.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingSpot])],
  controllers: [ParkingSpotController],
  providers: [ParkingSpotService],
  exports: [ParkingSpotService],
})
export class ParkingSpotModule {}

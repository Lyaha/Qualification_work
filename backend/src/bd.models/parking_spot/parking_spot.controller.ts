import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ParkingSpotService } from './parking_spot.service';
import { ParkingSpot } from '../entity/parking_spot.entity';

@Controller('parking-spot')
export class ParkingSpotController {
  constructor(private readonly parkingSpotService: ParkingSpotService) {}

  @Post()
  create(@Body() createParkingSpotDto: Partial<ParkingSpot>): Promise<ParkingSpot> {
    return this.parkingSpotService.create(createParkingSpotDto);
  }

  @Get()
  findAll(): Promise<ParkingSpot[]> {
    return this.parkingSpotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ParkingSpot> {
    return this.parkingSpotService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateParkingSpotDto: Partial<ParkingSpot>,
  ): Promise<ParkingSpot> {
    return this.parkingSpotService.update(id, updateParkingSpotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.parkingSpotService.remove(id);
  }
}

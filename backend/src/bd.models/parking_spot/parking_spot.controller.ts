import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ParkingSpotService } from './parking_spot.service';
import { ParkingSpot } from '../entity/parking_spot.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateParkingSpotDto } from '../dto/parking-spot.dto';

@ApiTags('Parking Spots')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('parking-spot')
export class ParkingSpotController {
  constructor(private readonly parkingSpotService: ParkingSpotService) {}

  @Post()
  @ApiOperation({ summary: 'Create new parking spot' })
  @ApiResponse({ status: 201, type: ParkingSpot })
  create(@Body() createDto: CreateParkingSpotDto): Promise<ParkingSpot> {
    return this.parkingSpotService.create(createDto);
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

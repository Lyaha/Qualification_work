import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { StorageZoneService } from './storage_zone.service';
import { StorageZone } from '../entity/storage_zone.entity';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateStorageZoneDto } from '../dto/storage-zone.dto';

@ApiTags('Storage Zones')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('storage-zone')
export class StorageZoneController {
  constructor(private readonly storageZoneService: StorageZoneService) {}

  @Post()
  @ApiOperation({ summary: 'Create new storage zone' })
  @ApiResponse({ status: 201, type: StorageZone })
  create(@Body() createDto: CreateStorageZoneDto): Promise<StorageZone> {
    return this.storageZoneService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all storage zones' })
  @ApiResponse({ status: 200, type: [StorageZone] })
  findAll(): Promise<StorageZone[]> {
    return this.storageZoneService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get storage zone by ID' })
  @ApiParam({ name: 'id', description: 'Storage zone UUID' })
  @ApiResponse({ status: 200, type: StorageZone })
  findOne(@Param('id') id: string): Promise<StorageZone> {
    return this.storageZoneService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update storage zone' })
  @ApiParam({ name: 'id', description: 'Storage zone UUID' })
  @ApiResponse({ status: 200, type: StorageZone })
  update(@Param('id') id: string, @Body() updateDto: CreateStorageZoneDto): Promise<StorageZone> {
    return this.storageZoneService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete storage zone' })
  @ApiParam({ name: 'id', description: 'Storage zone UUID' })
  @ApiResponse({ status: 200, description: 'Storage zone deleted successfully' })
  remove(@Param('id') id: string): Promise<void> {
    return this.storageZoneService.remove(id);
  }

  @Get('/by-warehouse/:warehouseId')
  @ApiOperation({ summary: 'Get storage zones by warehouse' })
  @ApiParam({ name: 'warehouseId', description: 'Warehouse UUID' })
  @ApiResponse({ status: 200, type: [StorageZone] })
  getStorageZonesByWarehouse(@Param('warehouseId') warehouseId: string): Promise<StorageZone[]> {
    return this.storageZoneService.findByWarehouseId(warehouseId);
  }
}

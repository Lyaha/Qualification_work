import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { StorageZoneService } from './storage_zone.service';
import { StorageZone } from '../entity/storage_zone.entity';

@Controller('storage-zone')
export class StorageZoneController {
  constructor(private readonly storageZoneService: StorageZoneService) {}

  @Post()
  create(@Body() createStorageZoneDto: Partial<StorageZone>): Promise<StorageZone> {
    return this.storageZoneService.create(createStorageZoneDto);
  }

  @Get()
  findAll(): Promise<StorageZone[]> {
    return this.storageZoneService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<StorageZone> {
    return this.storageZoneService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateStorageZoneDto: Partial<StorageZone>,
  ): Promise<StorageZone> {
    return this.storageZoneService.update(id, updateStorageZoneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.storageZoneService.remove(id);
  }
}

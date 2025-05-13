import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { WarehousesService } from './warhouses.service';
import { Warehouse } from '../entity/warehouse.entity';

@Controller('Warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Get()
  findAll(): Promise<Warehouse[]> {
    return this.warehousesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Warehouse> {
    return this.warehousesService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Warehouse>): Promise<Warehouse> {
    return this.warehousesService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Warehouse>): Promise<Warehouse> {
    return this.warehousesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.warehousesService.remove(id);
  }
}

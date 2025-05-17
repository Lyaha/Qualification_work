import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { Warehouse } from '../entity/warehouse.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('warehouses')
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

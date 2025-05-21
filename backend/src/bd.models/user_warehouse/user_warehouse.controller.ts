import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { UserWarehousesService } from './user_warehouse.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserWarehouse } from '../entity';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('user-warehouse')
export class UserWarehouseController {
  constructor(private readonly userWarehouseService: UserWarehousesService) {}

  @Get()
  findAll(): Promise<UserWarehouse[]> {
    return this.userWarehouseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserWarehouse> {
    return this.userWarehouseService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<UserWarehouse>): Promise<UserWarehouse> {
    return this.userWarehouseService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<UserWarehouse>): Promise<UserWarehouse> {
    return this.userWarehouseService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.userWarehouseService.remove(id);
  }
}

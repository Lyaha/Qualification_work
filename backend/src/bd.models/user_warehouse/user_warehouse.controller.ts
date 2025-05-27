import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { UserWarehousesService } from './user_warehouse.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserWarehouse } from '../entity';
import { CreateUserWarehouseDto } from '../dto/user-warehouse.dto';

@ApiTags('User Warehouses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('user-warehouse')
export class UserWarehouseController {
  constructor(private readonly userWarehouseService: UserWarehousesService) {}

  @Post()
  @ApiOperation({ summary: 'Assign user to warehouse' })
  @ApiResponse({ status: 201, type: UserWarehouse })
  create(@Body() createDto: CreateUserWarehouseDto): Promise<UserWarehouse> {
    return this.userWarehouseService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user warehouse assignments' })
  @ApiResponse({ status: 200, type: [UserWarehouse] })
  findAll(): Promise<UserWarehouse[]> {
    return this.userWarehouseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserWarehouse> {
    return this.userWarehouseService.findOne(id);
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

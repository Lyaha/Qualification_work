import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { SupplyOrderService } from './supply_order.service';
import { SupplyOrder } from '../entity/supply_order.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateSupplyOrderDto } from '../dto/supply-order.dto';

@ApiTags('Supply Orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('supply-order')
export class SupplyOrderController {
  constructor(private readonly supplyOrderService: SupplyOrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create new supply order' })
  @ApiResponse({ status: 201, description: 'Supply order created successfully' })
  create(@Body() createSupplyOrderDto: CreateSupplyOrderDto): Promise<SupplyOrder> {
    return this.supplyOrderService.create(createSupplyOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all supply orders' })
  @ApiResponse({ status: 200, description: 'List of all supply orders' })
  findAll(): Promise<SupplyOrder[]> {
    return this.supplyOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<SupplyOrder> {
    return this.supplyOrderService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupplyOrderDto: Partial<SupplyOrder>,
  ): Promise<SupplyOrder> {
    return this.supplyOrderService.update(id, updateSupplyOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.supplyOrderService.remove(id);
  }
}
